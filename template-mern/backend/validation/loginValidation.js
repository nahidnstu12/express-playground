import { check, validationResult } from "express-validator";

export const doLoginValidators = [
  check("username")
    .isLength({
      min: 3,
    })
    .withMessage("username or email is required"),
  check("password").isLength({ min: 1 }).withMessage("Password is required"),
];

// object format
export const doLoginValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
//   const errors = validationResult(req).formatWith(errorFormatter);
   if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // response the errors
    res.status(400).json({
      errors: mappedErrors,
    });
  }
};

// array format
export const doLoginValidationHandler2 = (req, res, next) => {
  const errorFormatter = ({ msg, param }) => `${param} : ${msg}`;
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  }
  next();
};

