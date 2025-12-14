const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Use a service like Gmail, Outlook, or SendGrid
  // For Gmail, you might need an "App Password" if 2FA is on
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME, // Add this to your .env
      pass: process.env.EMAIL_PASSWORD, // Add this to your .env
    },
  });

  const mailOptions = {
    from: `"IntelliClass Support" <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
