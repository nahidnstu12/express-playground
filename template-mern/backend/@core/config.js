import dotenv from "dotenv";
dotenv.config();

const appConfig = {
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
};

export default appConfig;
