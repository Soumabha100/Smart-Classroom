// server/controllers/aiController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
const NodeCache = require("node-cache");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

// --- CONFIGURATION ---
const aiCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
aiCache.flushAll();
console.log("✅ [INIT] AI Dashboard cache cleared.");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- HELPER FUNCTIONS ---
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- MAIN CONTROLLER ---
exports.generateDashboard = async (req, res) => {
  const { mode } = req.body;
  const userId = req.user.id;
  const cacheKey = `dashboard-${userId}-${mode}`;

  if (aiCache.has(cacheKey)) {
    console.log(`✅ Serving dashboard for user ${userId} from cache.`);
    return res.status(200).json(aiCache.get(cacheKey));
  }

  try {
    // --- 1. DATA AGGREGATION ---
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

    // --- 2. PROMPT ENGINEERING ---
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

    // --- 3. AI API CALL WITH RETRY ---
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
          return res
            .status(500)
            .json({
              message:
                "Failed to generate AI dashboard after multiple attempts.",
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
