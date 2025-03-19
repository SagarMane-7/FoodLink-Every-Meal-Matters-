require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendEmail(to, subject, html) {
  const mailOptions = {
    from: `"FoodLink" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("❌ Email failed:", error);
    } else {
      console.log("✅ Email sent:", info.response);
    }
  });
}

module.exports = sendEmail;
