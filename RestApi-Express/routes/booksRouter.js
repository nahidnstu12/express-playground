const router = require("express").Router();
const Joi = require("joi");
const { body, validationResult } = require("express-validator");
const books = [
  { name: "JS Program", author: "HM Nayem" },
  { name: "JS Tutorial", author: "Sumit Shaha" },
  { name: "Mern Bootcamp", author: "HM Nayem" },
  { name: "Mern Tutorial", author: "Sumit Shaha" },
];
const people = {
  name: "Mazharul Islam",
  username: "nahid",
  email: "nahid@maail.com",
  phone: "01231121211",
  password: "123123",
  confirmPass: "123123",
  address: [
    {
      street: "12AB",
      zip: "3430",
      house: "Nizam Villa",
    },
  ],
  skills: "JS, REACTJS, NEXTJS",
};
const validateMiddleware = [
  body("name")
    .trim()
    .isString()
    .withMessage("not valid string")
    .bail()
    .isLength({ min: 5, max: 30 })
    .withMessage("name should be 5-30 chars"),
  body("username"),
  body("email")
    .normalizeEmail({ all_lowercase: true })
    .isEmail()
    .withMessage("not valid email")
    .custom((v) => {
      if (v === "nahid@mail.com") {
        throw new Error("Mail already in used");
      }
      return true;
    }),
  body("password")
    .isString()
    .withMessage("not valid string")
    .isLength({ min: 6, max: 30 })
    .withMessage("name should be 6-30 chars")
    .bail()
    .isStrongPassword()
    .withMessage("not strong pass"),
  body("confirmPass")
    .isString()
    .withMessage("not valid string")
    .custom((v, { req }) => {
      if (v !== req.body.password) {
        throw new Error("Password don't match");
      }
      return true;
    }),

  body("phone"),
  body("address")
    .optional()
    .custom((v) => {
      if (!Array.isArray(v)) {
        throw new Error("Provide array of object");
      }
      return true;
    }),
  body("address.*.post").isNumeric().withMessage("not numeric").toInt(),
  body("skills")
    .optional()
    .trim()
    .not()
    .isEmpty()
    .withMessage("not valid string")
    .customSanitizer((v) => {
      return v.split(",").map((item) => item.trim());
    }),
];
const validateHandler = (req, res, next) => {
  const errorFormatter = ({ msg, param }) => `${param} : ${msg}`;
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  }
  next();
};
const pplhandler = (req, res) => {
  console.log(req.body);
  res.status(200).json({ msg: "All Set", result: req.body });
};
// express validator
router.post("/ppl", validateMiddleware, validateHandler, pplhandler);

router.get("/", function (req, res) {
  const bookName = req.query.name;
  if (!bookName) {
    res
      .status(400)
      .json({ msg: "book name is required", error: "Bad Request" });
  }
  const findBook = books.find((item) => item.name === bookName);
  console.log(findBook);
  return res.status(200).json(findBook);
});

router.post("/", function (req, res) {
  const { name, author } = req.body;
  if (!name) {
    res
      .status(400)
      .json({ msg: "book name is required", error: "Bad Request" });
  }
  if (!author) {
    res
      .status(400)
      .json({ msg: "author name is required", error: "Bad Request" });
  }
  books.push({ name, author });

  //   console.log(bookLists)
  return res.status(200).json(books);
});

/**
 * Joi Validator
 */

// create joi schema
const strongPasswordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPassswordError = new Error(
  "Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length"
);
const schema = Joi.object({
  name: Joi.string().trim().min(5).max(30).required().messages({
    "string.base": "Required field should be string",
    "string.min": "required more than 3 chars",
    "string.max": "required less than 30 chars",
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
    .normalize()
    .custom((v) => {
      if (v === "nahid@mail.com") {
        throw new Error("Email Alreay in Used");
      }
      return v;
    })
    .required()
    .messages({
      "any.custom": "Email already in used",
    }),
  username: Joi.string().trim().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .max(30)
    .pattern(strongPasswordRegex)
    .required()
    .messages({ "string.pattern.base": stringPassswordError }),
  confirmPass: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({ "any.only": "Password won't match" }),
  address: Joi.array().items(
    Joi.object({ city: Joi.string(), post: Joi.number() })
  ),
  skills: Joi.string().custom((v) => v.split(",").map((item) => item.trim())),
});
// controller
const handler = (req, res) => {
  const result = schema.validate(req.body, { abortEarly: false });
  if (result.error) {
    const errors = result.error.details.reduce((acc,curr)=> {
      acc[curr.path[0]] = curr.message
      return acc
    },{})
    console.log(result.error.details);
    res.status(400).json(errors);
  }

  console.log(result.value);
  res.status(201).json(result.value);
};
// route
router.post("/joi-validator", handler);

module.exports = router;
