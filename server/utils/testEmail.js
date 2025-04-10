require("dotenv").config({ path: "../.env" });
const sendEmail = require("./sendEmail");

console.log("User:", process.env.EMAIL_USER);

(async () => {
  await sendEmail(
    "naumanpathan98239@gmail.com",
    "Test Subject",
    "<h1>Hello from SpeakUp 🚀</h1><p>This is a test email.</p>"
  );
})();
