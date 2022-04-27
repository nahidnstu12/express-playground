const router = require("express").Router();
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

router.post("/ppl", validateMiddleware, validateHandler, pplhandler);
/* GET home page. */
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

module.exports = router;
