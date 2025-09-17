const { GoogleGenerativeAI } = require("@google/generative-ai");
const NodeCache = require("node-cache");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Class = require("../models/Class");

// Cache setup remains the same
const aiCache = new NodeCache({ stdTTL: 600 });

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateDashboard = async (req, res) => {
  try {
    const { mode } = req.body;
    const userId = req.user.id;

    const cacheKey = `dashboard-${userId}-${mode}`;
    if (aiCache.has(cacheKey)) {
      console.log(`✅ Serving dashboard for user ${userId} from cache.`);
      return res.status(200).json(aiCache.get(cacheKey));
    }

    console.log(
      `⚡️ Generating new dashboard for user ${userId}. Not found in cache.`
    );

    // --- Data Aggregation ---
    const student = await User.findById(userId).select("-password");
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found." });
    }

    const attendanceRecords = await Attendance.find({ student: userId })
      .sort({ date: -1 })
      .limit(10);
    const studentClasses = await Class.find({ students: userId }).populate(
      "teacher",
      "name"
    );
    const assignments = await Assignment.find({
      class: { $in: studentClasses.map((c) => c._id) },
    }).sort({ dueDate: 1 });
    const submissions = await Submission.find({ student: userId }).populate(
      "assignment",
      "title"
    );

    const totalAttendance = await Attendance.countDocuments({
      student: userId,
    });
    const presentAttendance = await Attendance.countDocuments({
      student: userId,
      status: "present",
    });
    const attendancePercentage =
      totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 100;

    const averageGrade =
      submissions.length > 0
        ? submissions.reduce((acc, sub) => acc + (sub.grade || 0), 0) /
          submissions.length
        : 0;

    // --- Prompt Engineering ---
    // ✨ THIS IS THE FIX: Reverting to the correct and latest model name ✨
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `
            You are an expert AI academic advisor for a platform called IntelliClass.
            Your task is to generate a personalized dashboard layout in a specific JSON format for a student.
            Do NOT include any markdown formatting (like \`\`\`json) in your output. Only return the raw JSON object.

            Student Data:
            - Name: ${student.name}
            - Interests: ${
              student.interests ? student.interests.join(", ") : "Not specified"
            }
            - Recent Attendance: ${attendanceRecords
              .map((a) => `${a.date.toDateString()}: ${a.status}`)
              .join("; ")}
            - Overall Attendance: ${attendancePercentage.toFixed(2)}%
            - Average Grade: ${averageGrade.toFixed(2)}%
            - Upcoming Assignments: ${assignments
              .slice(0, 3)
              .map((a) => `${a.title} due on ${a.dueDate.toDateString()}`)
              .join("; ")}

            Based on the student's data and the selected mode "${mode}", generate a JSON object for their dashboard.

            Available Widget Types:
            - "header": A welcoming header. Must include a 'title' and 'subtitle'.
            - "todoList": A list of actionable items. Must include a 'title' and an array of 'tasks' (each with 'id', 'text', 'completed').
            - "quickStats": Key metrics. Must include a 'title' and an array of 'stats' (each with 'label', 'value').
            - "careerSuggestion": Career guidance. Must include a 'title' and a 'suggestion' text.
            - "motivationalQuote": An inspiring quote. Must include 'quote' and 'author'.
            - "learningSuggestion": A resource suggestion. Must include a 'title' and a 'suggestion' text.

            Rules for JSON Generation:
            - The root object must have a single key: "widgets".
            - "widgets" must be an array of widget objects.
            - Each widget object in the array must have a unique 'id' (as a string), a 'type' (from the list above), and a 'data' object containing the required fields for that type.
            - Generate 3 to 4 relevant widgets based on the mode.

            Mode: "${mode}"

            Now, generate the JSON for this student.
        `;

    // --- AI API Call ---
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // --- Response Handling ---
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const dashboardJson = JSON.parse(cleanedText);

    aiCache.set(cacheKey, dashboardJson);
    console.log(`📦 Stored new dashboard for user ${userId} in cache.`);

    res.status(200).json(dashboardJson);
  } catch (error) {
    console.error("Error generating AI dashboard:", error);
    if (error.status === 429) {
      return res
        .status(429)
        .json({
          message: "The AI is currently busy. Please try again in a minute.",
        });
    }
    res
      .status(500)
      .json({
        message: "Failed to generate AI dashboard content.",
        error: error.message,
      });
  }
};
