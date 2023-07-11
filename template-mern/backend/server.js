import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import path from "path";

// internal imports
import userRoute from "./route/userRoute.js";
import authRoute from "./route/authRoute.js";

dotenv.config();


// app scafolding
const app = express();

// database connection
try {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, ()=> {
    console.log("Connection Successful!");
  });

} catch (err) {
  console.log(err);
}

// global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.url, "public")));
app.use(logger("dev"));

// routeHandler
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.json({
    error: "Not found",
  });
  return;
});

// Error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: err.message,
  });
  return;
});
// console.log(process.env.MONGO_CONNECTION_STRING);

//create server
app.listen(process.env.PORT || 6050, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

// module.exports = app;
export default app;