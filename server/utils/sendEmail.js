// server/utils/sendEmail.js

const sendEmail = async (options) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_FROM || "support@intelliclass.com"; // Must be verified in Brevo

  if (!apiKey) {
    console.error("❌ BREVO_API_KEY is missing in Environment Variables");
    throw new Error("Email configuration missing");
  }

  // Use the native fetch API (available in Node.js 18+)
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: "IntelliClass Support" },
      to: [{ email: options.email }],
      subject: options.subject,
      htmlContent: options.message, // Brevo uses 'htmlContent', not 'html'
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Brevo API Error:", JSON.stringify(errorData, null, 2));
    throw new Error("Failed to send email via Brevo");
  }

  console.log("✅ Email sent successfully via Brevo HTTP API");
};

module.exports = sendEmail;
