const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"SpeakUp" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent to", to, "Message ID:", info.messageId);
    return info;
  } catch (err) {
    console.error("Email error:", err.message);
    throw new Error(`Failed to send email: ${err.message}`);
  }
};

module.exports = sendEmail;
