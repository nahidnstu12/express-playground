import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import appConfig from "../@core/config.js";
let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: appConfig.EMAIL_USERNAME, // generated ethereal user
    pass: appConfig.EMAIL_PASSWORD, // generated ethereal password
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  // body of the email
  let email = {
    body: {
      name: username,
      intro:
        text ||
        "Welcome to Rest Api Service! We're very excited to have you on board.",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
  let emailBody = mailGenerator.generate(email);

  let message = {
    from: process.env.EMAIL_USERNAME,
    to: userEmail,
    subject: subject || "Test subject",
    html: emailBody,
  };
  console.log(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);

  let info = await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: userEmail,
    subject: subject || "Test subject",
    text: "Hello world?", // plain text body
    html: emailBody, // html body
  });
  console.log("Message sent: %s", info.messageId);
  return res
    .status(200)
    .send({ msg: "You should have been received email from our service." });

  // transporter.sendMail(message).then(() => {
  //   return res
  //     .status(200)
  //     .send({ msg: "You should have been received email from our service." })
  //     .catch((error) =>
  //       res.status(500).send({ error, dev_note: "mail can't send" }),
  //     );
  // });
};
