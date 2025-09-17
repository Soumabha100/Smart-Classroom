const { GoogleGenerativeAI } = require("@google/generative-ai");
const NodeCache = require("node-cache");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Class = require("../models/Class");

// Cache setup with a 24-hour TTL
const aiCache = new NodeCache({ stdTTL: 86400 });

// THIS IS THE CRITICAL PART: Forcefully clear the cache on every single restart.
aiCache.flushAll();
console.log("✅ [INIT] AI Dashboard cache has been completely cleared.");

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.generateDashboard = async (req, res) => {
  const { mode } = req.body;
  const userId = req.user.id;
  const cacheKey = `dashboard-${userId}-${mode}`;

  if (aiCache.has(cacheKey)) {
    console.log(`✅ Serving dashboard for user ${userId} from cache.`);
    return res.status(200).json(aiCache.get(cacheKey));
  }

  const student = await User.findById(userId).select("-password");
  if (!student) return res.status(404).json({ message: "Student not found." });

  // Data aggregation... (remains the same)
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
  const totalAttendance = await Attendance.countDocuments({ student: userId });
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

  const prompt = `
    You are an expert AI academic advisor for IntelliClass.
    Your task is to generate a personalized dashboard layout in a specific JSON format.
    IMPORTANT: Your entire response must be ONLY the raw JSON object, without any markdown formatting like \`\`\`json, commentary, or extra text.

    Student Data:
    - Name: ${student.name}
    - Interests: ${
      student.interests ? student.interests.join(", ") : "Not specified"
    }
    - Overall Attendance: ${attendancePercentage.toFixed(2)}%
    - Average Grade: ${averageGrade.toFixed(2)}%

    Selected Mode: "${mode}"

    Available Widget Types: "header", "quickStats", "todoList", "careerSuggestion", "learningSuggestion", "motivationalQuote".

    Generate 3 to 4 relevant widgets. Here is a PERFECT example of the required output format:
    {
      "widgets": [
        { "id": "header-1", "type": "header", "data": { "title": "Welcome, ${
          student.name
        }!", "subtitle": "Let's focus on learning." } },
        { "id": "stats-1", "type": "quickStats", "data": { "title": "Academic Snapshot", "stats": [ { "label": "Attendance", "value": "${attendancePercentage.toFixed(
          1
        )}%" } ] } }
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
        model: "models/gemini-1.5-flash-latest",
      }); // Using a reliable model from your list
      const result = await model.generateContent(prompt);
      const response = await result.response;
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
        return res
          .status(500)
          .json({
            message: "Failed to generate AI dashboard after multiple attempts.",
          });
      }
      await sleep(1000);
    }
  }
};
