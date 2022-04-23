const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const shortid = require("shortid");
const {
  createTodo,
  createBulkTodo,
  findAll,
  findSingleTodo,
  updateTodoByPatch,
  updateTodoByPut,
  deleteTodo,
  randomTwoTodo,
} = require("../controller/todoController");


// const todo = new Todo()

router.get("/health", async (req, res) => {
  try {
    res.status(200).json("<h1>Hello Nahid</h1>");
  } catch (err) {
    console.log(err);
    res.status(err.status).json(`<h1>${err.message}</h1>`);
  }
});

// create a todo
router.post("/", createTodo);

// create multiple todo
router.post("/bulk", createBulkTodo);

// get all todos
router.get("/", findAll);
// get single todos
router.get("/:id", findSingleTodo);

// uppdate todo (patch)
router.patch("/:id", updateTodoByPatch);

//  update / create (put) //don't work
router.put("/:id", updateTodoByPut);

// delete todo
router.delete("/:id", deleteTodo);

// random 3 todo
router.get("/play/random", randomTwoTodo);
module.exports = router;
