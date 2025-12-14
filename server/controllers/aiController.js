const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const ChatHistory = require("../models/ChatHistory");

// --- CONFIGURATION ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- HELPER FUNCTIONS ---
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ===================================================================================
// AI DASHBOARD CONTROLLER (OPTIMIZED WITH DB CACHING & ASYNCHANDLER)
// ===================================================================================
exports.generateDashboard = asyncHandler(async (req, res) => {
  const { mode } = req.body; // e.g., "learning", "planning"
  const userId = req.user.id;
  const CACHE_DURATION_HOURS = 24;

  // --- 🛡️ INPUT VALIDATION: Prevent map explosion attacks ---
  const validModes = ["learning", "career", "planning"];
  if (!validModes.includes(mode)) {
    res.status(400);
    throw new Error(
      "Invalid dashboard mode selected. Valid modes: learning, career, planning."
    );
  }

  // 1. Fetch User to check Cache
  const student = await User.findById(userId).select("-password");
  if (!student) {
    res.status(404);
    throw new Error("Student not found.");
  }

  // 2. Check Database Cache
  if (student.dashboardCache && student.dashboardCache.has(mode)) {
    const cachedEntry = student.dashboardCache.get(mode);
    const now = new Date();
    const lastUpdated = new Date(cachedEntry.lastUpdated);
    const diffInHours = (now - lastUpdated) / (1000 * 60 * 60);

    if (diffInHours < CACHE_DURATION_HOURS) {
      console.log(
        `✅ [CACHE HIT] Serving existing ${mode} dashboard for ${
          student.name
        }. (Age: ${diffInHours.toFixed(2)}h)`
      );
      return res.status(200).json(cachedEntry.data);
    }
  }

  // 3. Data is missing or stale -> Generate new data
  console.log(
    `⚡️ [API CALL] Generating new ${mode} dashboard for ${student.name}.`
  );

  // --- 🚀 PERFORMANCE OPTIMIZATION: Parallel queries with Promise.all ---
  const [
    attendanceRecords,
    studentClasses,
    submissions,
    totalAttendance,
    presentAttendance,
  ] = await Promise.all([
    Attendance.find({ studentId: userId }).sort({ timestamp: -1 }).limit(5),
    Class.find({ students: userId }),
    Submission.find({ studentId: userId }),
    Attendance.countDocuments({ studentId: userId }),
    Attendance.countDocuments({ studentId: userId, status: "Present" }),
  ]);

  // Dependent query (needs studentClasses from above)
  const classIds = studentClasses.map((c) => c._id);
  const assignments = await Assignment.find({ classId: { $in: classIds } })
    .sort({ dueDate: 1 })
    .limit(5);
  const attendancePercentage =
    totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;

  const averageGrade =
    submissions.length > 0
      ? submissions.reduce((acc, sub) => acc + (sub.marks || 0), 0) /
        submissions.length
      : 0;

  // 4. Construct Prompt
  const prompt = `
      You are an expert AI academic advisor for a platform called IntelliClass.
      Your task is to generate a personalized dashboard layout in a specific JSON format for a student.
      IMPORTANT: Your entire response must be ONLY the raw JSON object.

      Student Data:
      - Name: ${student.name}
      - Interests: ${
        student.profile?.academicInterests?.join(", ") || "Not specified"
      }
      - Recent Attendance: ${
        attendanceRecords.length > 0
          ? attendanceRecords
              .map(
                (a) =>
                  `${a.status} on ${new Date(a.timestamp).toLocaleDateString()}`
              )
              .join("; ")
          : "No recent records"
      }
      - Overall Attendance: ${attendancePercentage.toFixed(1)}%
      - Average Grade: ${averageGrade.toFixed(1)}%
      - Upcoming Assignments: ${
        assignments.length > 0
          ? assignments
              .map(
                (a) =>
                  `${a.title} due on ${new Date(
                    a.dueDate
                  ).toLocaleDateString()}`
              )
              .join("; ")
          : "No upcoming assignments"
      }

      Selected Mode: "${mode}"
      Available Widget Types: "header", "quickStats", "todoList", "careerSuggestion", "learningSuggestion", "motivationalQuote".

      Generate 3 to 4 relevant widgets based on the student's data and the selected mode. 
      For "quickStats", use the aggregated data provided above.
      For "motivationalQuote", find a suitable quote.

      Output strictly valid JSON:
      {
        "widgets": [
          { "id": "header-1", "type": "header", "data": { "title": "Welcome, ${
            student.name
          }!", "subtitle": "Let's focus on your learning journey." } },
           ... other widgets
        ]
      }
    `;

  // 5. Call Gemini API with Retry Logic
  let retries = 3;
  let dashboardJson = null;

  while (retries > 0) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
      });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      dashboardJson = JSON.parse(cleanedText);
      break; // Success, exit loop
    } catch (error) {
      console.error(`⚠️ Attempt ${4 - retries} failed: ${error.message}`);
      retries--;
      if (retries === 0)
        throw new Error("AI generation failed after multiple attempts.");
      await sleep(1000);
    }
  }

  // 6. Save to Database (The Core Efficiency Change)
  if (dashboardJson) {
    // Ensure dashboardCache map exists (if migrating old users)
    if (!student.dashboardCache) {
      student.dashboardCache = new Map();
    }

    // Update the specific mode
    student.dashboardCache.set(mode, {
      data: dashboardJson,
      lastUpdated: new Date(),
    });

    // Mark the field as modified so Mongoose saves the Map changes
    student.markModified("dashboardCache");
    await student.save();

    console.log(`💾 [DB SAVE] Dashboard for mode '${mode}' saved to database.`);
  }

  res.status(200).json(dashboardJson);
});

// ===================================================================================
// NEW MULTI-CHAT SYSTEM
// ===================================================================================

/**
 * Handles a new message in a chat session. Finds the chat by chatId or creates a new one.
 */
exports.ask = asyncHandler(async (req, res) => {
  // --- FIX: Extract variables from request first ---
  const { chatId } = req.body;
  let { prompt } = req.body;
  const file = req.file;
  const userId = req.user.id;

  // Validate input
  if (!prompt && !file) {
    res.status(400);
    throw new Error("Prompt or file is required.");
  }

  // 2. Get or Create Chat History
  let chatHistory = await ChatHistory.findOne({ chatId, user: userId });
  if (!chatHistory) {
    chatHistory = new ChatHistory({
      user: userId,
      chatId,
      history: [],
    });
  }

  // --- 🆕 FIX: Convert DB History to Gemini Format for AI Memory ---
  const historyForGemini = chatHistory.history.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: msg.parts.map((p) => ({ text: p.text })),
  }));

  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  // --- 🆕 USE startChat WITH HISTORY (AI Now Has Memory!) ---
  const chat = model.startChat({
    history: historyForGemini,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  const inputParts = [];
  let fileLog = ""; // For storing in DB history

  if (file) {
    const mimeType = file.mimetype;
    const ext = path.extname(file.originalname).toLowerCase();

    // List of extensions we treat as TEXT/CODE
    const codeExtensions = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".py",
      ".java",
      ".cpp",
      ".c",
      ".h",
      ".cs",
      ".html",
      ".css",
      ".json",
      ".txt",
      ".md",
      ".sql",
      ".xml",
      ".env",
    ];

    if (codeExtensions.includes(ext) || mimeType.startsWith("text/")) {
      // --- HANDLE TEXT/CODE FILES ---
      // Convert buffer to string and append to prompt
      const fileContent = file.buffer.toString("utf-8");
      prompt = `${prompt || "Here is the file:"}\n\nFile Name: ${
        file.originalname
      }\n\`\`\`${ext.substring(1)}\n${fileContent}\n\`\`\``;
      fileLog = `[Uploaded Code: ${file.originalname}]`;
    } else {
      // --- HANDLE IMAGES / PDF (Binary) ---
      // Gemini supports images (jpeg, png, webp) and PDF natively as inlineData
      inputParts.push({
        inlineData: {
          data: file.buffer.toString("base64"),
          mimeType: mimeType,
        },
      });
      fileLog = `[Uploaded File: ${file.originalname}]`;
    }
  }

  // Add the text prompt (which might now include the code content)
  if (prompt) {
    inputParts.push(prompt);
  }

  // 4. Generate Content using chat.sendMessage (NOT model.generateContent)
  const result = await chat.sendMessage(inputParts);
  const response = await result.response;
  const text = response.text();

  // 5. Save History
  // Note: We don't save the full binary file content to Mongo to save space.
  // We save the text prompt.
  const userMessageContent = file ? `${prompt} ${fileLog}` : prompt;

  chatHistory.history.push({
    role: "user",
    parts: [{ text: userMessageContent }],
  });
  chatHistory.history.push({ role: "model", parts: [{ text }] });

  // Generate title if it's the first exchange
  if (chatHistory.history.length <= 2) {
    const titlePrompt = `Generate a short title (3-5 words) for this chat: "${prompt.substring(
      0,
      50
    )}..."`;
    const titleResult = await model.generateContent(titlePrompt);
    const titleResponse = await titleResult.response;
    chatHistory.title = titleResponse.text().replace(/"/g, "").trim();
  }

  await chatHistory.save();
  res.status(200).json({ response: text });
});

/**
 * Fetches all chat history summaries (id and title) for the logged-in user.
 */
exports.getChatHistories = asyncHandler(async (req, res) => {
  const chatHistories = await ChatHistory.find({ user: req.user.id })
    .select("chatId title createdAt")
    .sort({ createdAt: -1 });
  res.status(200).json(chatHistories);
});

/**
 * Fetches the full message history for a single chat session by its chatId.
 */
exports.getChatHistoryByChatId = asyncHandler(async (req, res) => {
  const chatHistory = await ChatHistory.findOne({
    chatId: req.params.chatId,
    user: req.user.id,
  });

  if (!chatHistory) {
    res.status(404);
    throw new Error("Chat history not found or access denied.");
  }
  res.status(200).json(chatHistory);
});

/**
 * Deletes a chat session by its chatId.
 */
exports.deleteChatHistory = asyncHandler(async (req, res) => {
  const result = await ChatHistory.findOneAndDelete({
    chatId: req.params.chatId,
    user: req.user.id,
  });

  if (!result) {
    res.status(404);
    throw new Error("Chat history not found or access denied.");
  }

  res.status(200).json({ msg: "Chat history successfully deleted." });
});
