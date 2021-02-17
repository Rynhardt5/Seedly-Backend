const nodemailer = require("nodemailer");

const mailer = ({ from, to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rynhardt.smith@gmail.com",
      pass: "ffcnvfstofrdzvjx",
    },
  });

  const mailOptions = {
    from,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = mailer;
