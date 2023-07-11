import { check, validationResult } from "express-validator";
import createError from "http-errors";
import path from "path";
import { unlink } from "fs";

// internal imports
import User from "../models/userSchemas.js";


// add user
export const addUserValidators = [
  check("username")
    .isLength({ min: 3 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ username: value });
        if (user) {
          throw createError("Username already is use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already is use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  //   check("mobile")
  //     .isMobilePhone("bn-BD", {
  //       strictMode: true,
  //     })
  //     .withMessage("Mobile number must be a valid Bangladeshi mobile number")
  //     .custom(async (value) => {
  //       try {
  //         const user = await User.findOne({ mobile: value });
  //         if (user) {
  //           throw createError("Mobile already is use!");
  //         }
  //       } catch (err) {
  //         throw createError(err.message);
  //       }
  //     }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
];

export const addUserValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  //   console.log(Object.keys(mappedErrors).length);
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // remove uploaded files
    if (req.files?.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${filename}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    // response the errors
    res.status(400).json({
      errors: mappedErrors,
    });
  }
};

// update
export const updateUserValidators = [
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .optional(),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    )
    .optional(),
  check("role")
    .optional()
    .isIn(["admin", "customer"])
    .withMessage("Specify role properly"),
];

export const updateUserValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  //   console.log(Object.keys(mappedErrors).length);
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // remove uploaded files
    if (req.files?.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${filename}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    // response the errors
    res.status(400).json({
      errors: mappedErrors,
    });
  }
};
