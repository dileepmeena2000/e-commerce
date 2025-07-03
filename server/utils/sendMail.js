   import nodemailer from 'nodemailer'
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password, not your Gmail password
    },
  });

  const mailOptions = {
    from: '"E-Commerce App " <process.env.EMAIL_USER>',
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default  sendEmail;
