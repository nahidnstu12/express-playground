import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import appConfig from "../@core/config.js";
let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: appConfig.EMAIL_USERNAME,
    pass: appConfig.EMAIL_PASSWORD,
  },
};

export let transporter = nodemailer.createTransport(nodeConfig);

let mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const emailConfirmationBody = ({ username, userEmail, link }) => {
  let email = {
    body: {
      name: username || userEmail,
      intro: "Welcome to Mailgen! We're very excited to have you on board.",
      action: {
        instructions: "To get started with Mailgen, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Confirm your account",
          link: link,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
  let emailBody = mailGenerator.generate(email);

  return {
    from: process.env.EMAIL_USERNAME,
    to: userEmail,
    subject: "Email Confirmation",
    html: emailBody,
  };
};
export const phoneVerificationOTPBody = ({ username, userEmail, otp }) => {
  let email = {
    body: {
      name: username || userEmail,
      intro: "Welcome to Mailgen! We're very excited to have you on board.",
      action: {
        instructions: "Mobile verification OTP code here:",
        button: {
          color: "#170c13",
          text: otp,
          link: "",
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
  let emailBody = mailGenerator.generate(email);

  return {
    from: process.env.EMAIL_USERNAME,
    to: userEmail,
    subject: "Phone number verification otp",
    html: emailBody,
  };
};

export const registerMail = async (req, res) => {
  const { username, userEmail } = req.body;
  const link = "http://frontend.shared.local/courses/5";
  let info = await transporter.sendMail(
    emailConfirmationBody({ username, userEmail, link }),
  );
  console.log("Message sent: %s", info.messageId);
  return res
    .status(200)
    .send({ msg: "You should have been received email from our service." });
};
