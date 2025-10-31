const { GoogleGenerativeAI } = require("@google/generative-ai");
const NodeCache = require("node-cache");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const ChatHistory = require("../models/ChatHistory");

// --- CONFIGURATION ---
const aiCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
aiCache.flushAll();
console.log("✅ [INIT] AI Dashboard cache cleared.");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- HELPER FUNCTIONS ---
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ===================================================================================
// AI DASHBOARD CONTROLLER (EXISTING CODE - UNCHANGED)
// ===================================================================================
exports.generateDashboard = async (req, res) => {
  const { mode } = req.body;
  const userId = req.user.id;
  const cacheKey = `dashboard-${userId}-${mode}`;

  if (aiCache.has(cacheKey)) {
    console.log(`✅ Serving dashboard for user ${userId} from cache.`);
    return res.status(200).json(aiCache.get(cacheKey));
  }

  try {
    const student = await User.findById(userId).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

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

    const prompt = `
      You are an expert AI academic advisor for a platform called IntelliClass.
      Your task is to generate a personalized dashboard layout in a specific JSON format for a student.
      IMPORTANT: Your entire response must be ONLY the raw JSON object, without any markdown formatting like \`\`\`json, commentary, or extra text.

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
      For other widgets, create relevant, encouraging, and actionable content.

      Here is a PERFECT example of the required output format:
      {
        "widgets": [
          { "id": "header-1", "type": "header", "data": { "title": "Welcome, ${
            student.name
          }!", "subtitle": "Let's focus on your learning journey." } },
          { "id": "stats-1", "type": "quickStats", "data": { "title": "Academic Snapshot", "stats": [ { "label": "Attendance", "value": "${attendancePercentage.toFixed(
            1
          )}%" }, { "label": "Average Grade", "value": "${averageGrade.toFixed(
      1
    )}%" } ] } },
          { "id": "quote-1", "type": "motivationalQuote", "data": { "title": "Food for Thought", "quote": "The only way to do great work is to love what you do.", "author": "Steve Jobs" } }
        ]
      }

      Now, generate the JSON for this student.
    `;

    let retries = 3;
    while (retries > 0) {
      try {
        console.log(
          `⚡️ [Attempt ${
            4 - retries
          }] Calling AI to generate new dashboard for user ${userId}.`
        );

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
        const dashboardJson = JSON.parse(cleanedText);

        aiCache.set(cacheKey, dashboardJson);
        console.log(`📦 Stored new dashboard for user ${userId} in cache.`);

        return res.status(200).json(dashboardJson);
      } catch (error) {
        console.error("Error during AI generation attempt:", error.message);
        retries--;
        if (retries <= 0) {
          return res.status(500).json({
            message: "Failed to generate AI dashboard after multiple attempts.",
          });
        }
        await sleep(1000);
      }
    }
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
  // --- NEW SAFETY NET ---
  // This is the permanent fix. It checks for a valid user ID before doing anything else.
  if (!req.user || !req.user.id) {
    console.error("CRITICAL: /ai/ask route hit without a valid user ID.");
    return res.status(401).json({ message: "Not authorized. Please log in again." });
  }

  const { prompt, chatId } = req.body;
  const userId = req.user.id; // Now we know this is safe to use

  if (!prompt || !chatId) {
    return res.status(400).json({ message: "Prompt and chatId are required." });
  }

  try {
    let chatHistory = await ChatHistory.findOne({ chatId, user: userId });

    if (!chatHistory) {
      chatHistory = new ChatHistory({
        user: userId, // This is now guaranteed to be a valid ID
        chatId,
        history: [],
      });
    }

    // ... the rest of your 'ask' function remains the same
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const chat = model.startChat({
      history: chatHistory.history.map(item => ({
        role: item.role,
        parts: item.parts.map(part => ({ text: part.text })),
      })),
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    chatHistory.history.push({ role: 'user', parts: [{ text: prompt }] });
    chatHistory.history.push({ role: 'model', parts: [{ text }] });

    if (chatHistory.history.length === 2) {
      const titlePrompt = `Generate a short, descriptive title (3-5 words) for a conversation that starts with: "${prompt}"`;
      const titleResult = await model.generateContent(titlePrompt);
      const titleResponse = await titleResult.response;
      chatHistory.title = titleResponse.text().replace(/"/g, '').trim();
    }

    await chatHistory.save();
    res.status(200).json({ response: text });

  } catch (error) {
    console.error("Error in /ai/ask:", error);
    res.status(500).json({ message: "An error occurred with the AI service." });
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
