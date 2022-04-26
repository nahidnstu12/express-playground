var router = require("express").Router();
const books = [
  { name: "JS Program", author: "HM Nayem" },
  { name: "JS Tutorial", author: "Sumit Shaha" },
  { name: "Mern Bootcamp", author: "HM Nayem" },
  { name: "Mern Tutorial", author: "Sumit Shaha" },
];
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
  books.push({ name, author })

//   console.log(bookLists)
  return res.status(200).json(books);
});

module.exports = router;
