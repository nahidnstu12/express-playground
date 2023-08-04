import dotenv from "dotenv";
dotenv.config();

const appConfig = {
  MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
  PORT: process.env.port || 6050,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIARY: process.env.JWT_EXPIARY,

  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
};

export default appConfig;
