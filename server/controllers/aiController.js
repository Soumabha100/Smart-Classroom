const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
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
// AI DASHBOARD CONTROLLER (OPTIMIZED WITH DB CACHING)
// ===================================================================================
exports.generateDashboard = async (req, res) => {
  const { mode } = req.body; // e.g., "learning", "planning"
  const userId = req.user.id;
  const CACHE_DURATION_HOURS = 24;

  try {
    // 1. Fetch User to check Cache
    const student = await User.findById(userId).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // 2. Check Database Cache
    // We check if cache exists for this specific 'mode' and if it is fresh
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
        console.log("ℹ️ API Call Skipped: Data is fresh.");
        return res.status(200).json(cachedEntry.data);
      }
    }

    // 3. Data is missing or stale -> Prepare to Generate
    console.log(
      `⚡️ [API CALL] Generating new ${mode} dashboard for ${student.name}.`
    );

    const attendanceRecords = await Attendance.find({ studentId: userId })
      .sort({ timestamp: -1 })
      .limit(5);

    const studentClasses = await Class.find({ students: userId });
    const classIds = studentClasses.map((c) => c._id);

    const assignments = await Assignment.find({ classId: { $in: classIds } })
      .sort({ dueDate: 1 })
      .limit(5);

    const submissions = await Submission.find({ studentId: userId });

    const totalAttendance = await Attendance.countDocuments({
      studentId: userId,
    });
    const presentAttendance = await Attendance.countDocuments({
      studentId: userId,
      status: "Present",
    });
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

      console.log(
        `💾 [DB SAVE] Dashboard for mode '${mode}' saved to database.`
      );
    }

    return res.status(200).json(dashboardJson);
  } catch (err) {
    console.error("Error in generateDashboard controller:", err);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
};

// ===================================================================================
// OLD CHAT SYSTEM (DEPRECATED - PRESERVED FOR BACKWARD COMPATIBILITY)
// ===================================================================================

/**
 * @deprecated This function handles a single chat history per user.
 */
exports.getChatHistory = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({ userId: req.user.id });
    if (chatHistory) {
      res.status(200).json(chatHistory.history);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching chat history." });
  }
};

/**
 * @deprecated This function handles a single chat history per user.
 */
exports.chatWithAI = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user.id;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required." });
  }

  try {
    const user = await User.findById(userId);
    let chatHistory = await ChatHistory.findOne({ userId });

    if (!chatHistory) {
      chatHistory = new ChatHistory({ userId, history: [] });
    }

    const sanitizedHistory = chatHistory.history.map((item) => ({
      role: item.role,
      parts: item.parts.map((part) => ({ text: part.text })),
    }));

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    const chat = model.startChat({
      history: sanitizedHistory,
      generationConfig: { maxOutputTokens: 2048 },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    chatHistory.history.push(
      { role: "user", parts: [{ text: prompt }] },
      { role: "model", parts: [{ text }] }
    );

    await chatHistory.save();
    if (!user.chatHistory) {
      await User.findByIdAndUpdate(userId, { chatHistory: chatHistory._id });
    }

    res.status(200).json({ response: text });
  } catch (error) {
    console.error("Error in AI chat:", error);
    const errorMessage =
      error.message || "An error occurred with the AI service.";
    res.status(500).json({ message: errorMessage });
  }
};

// ===================================================================================
// NEW MULTI-CHAT SYSTEM
// ===================================================================================

/**
 * Handles a new message in a chat session. Finds the chat by chatId or creates a new one.
 */
exports.ask = async (req, res) => {
  // 1. Safety Checks
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ message: "Not authorized. Please log in again." });
  }

  const { chatId } = req.body;
  let { prompt } = req.body; // Allow prompt to be modified
  const file = req.file;
  const userId = req.user.id;

  if (!prompt && !file) {
    return res.status(400).json({ message: "Prompt or file is required." });
  }

  try {
    // 2. Get or Create Chat History
    let chatHistory = await ChatHistory.findOne({ chatId, user: userId });
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        user: userId,
        chatId,
        history: [],
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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

    // 4. Generate Content
    const result = await model.generateContent(inputParts);
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
  } catch (error) {
    console.error("Error in /ai/ask:", error);
    res.status(500).json({ message: "AI Error: " + error.message });
  }
};

/**
 * Fetches all chat history summaries (id and title) for the logged-in user.
 */
exports.getChatHistories = async (req, res) => {
  try {
    const chatHistories = await ChatHistory.find({ user: req.user.id })
      .select("chatId title createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json(chatHistories);
  } catch (error) {
    console.error("Error fetching chat histories:", error);
    res.status(500).send("Server error while fetching chat histories.");
  }
};

/**
 * Fetches the full message history for a single chat session by its chatId.
 */
exports.getChatHistoryByChatId = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({
      chatId: req.params.chatId,
      user: req.user.id,
    });

    if (!chatHistory) {
      return res
        .status(404)
        .json({ msg: "Chat history not found or access denied." });
    }
    res.status(200).json(chatHistory);
  } catch (error) {
    console.error("Error fetching single chat history:", error);
    res.status(500).send("Server error while fetching chat history.");
  }
};

/**
 * Deletes a chat session by its chatId.
 */
exports.deleteChatHistory = async (req, res) => {
  try {
    const result = await ChatHistory.findOneAndDelete({
      chatId: req.params.chatId,
      user: req.user.id,
    });

    if (!result) {
      return res
        .status(404)
        .json({ msg: "Chat history not found or access denied." });
    }

    res.status(200).json({ msg: "Chat history successfully deleted." });
  } catch (error) {
    console.error("Error deleting chat history:", error);
    res.status(500).send("Server error while deleting chat history.");
  }
};
