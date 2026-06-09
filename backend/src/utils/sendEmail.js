const nodemailer = require('nodemailer');

const generateOtpTemplate = (otp) => {
  return `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="#" style="font-size:1.4em;color: #3182ce;text-decoration:none;font-weight:600">URL Shortener</a>
        </div>
        <p style="font-size:1.1em">Hi there,</p>
        <p>You requested an OTP. Use the following One-Time Password (OTP) to complete your process. This OTP is valid for 10 minutes.</p>
        <h2 style="background: #3182ce;margin: 20px auto;width: max-content;padding: 10px 20px;color: #fff;border-radius: 8px;letter-spacing: 5px;">${otp}</h2>
        <p style="font-size:0.9em;">If you did not request this OTP, please ignore this email or contact support.</p>
        <p style="font-size:0.9em;">Regards,<br />URL Shortener Team</p>
      </div>
    </div>
  `;
};

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail, generateOtpTemplate };
