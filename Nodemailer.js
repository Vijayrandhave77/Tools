// const nodemailer = require('nodemailer')

 

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'cordell.mohr65@ethereal.email',
        pass: 'yuFcJQcTFah2Qq6xjA'
    }
});
// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'cordell.mohr65@et ', // sender address
    to: "againnnn@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "your_email@gmail.com",
      pass: "your_app_password",
    },
  });


  const mailOptions = {
    from: "your_email@gmail.com",
    to: "recipient@example.com",
    subject: "Hello from Nodemailer",
    text: "This is a test email sent using Nodemailer.",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });