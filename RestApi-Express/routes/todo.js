const express = require("express");
const router = express.Router();
const {
  createTodo,
  createBulkTodo,
  findAll,
  findSingleTodo,
  updateTodoByPatch,
  updateTodoByPut,
  deleteTodo,
  randomTwoTodo,
  getActiveTodo,
  getActiveTodoCB,
  getByLanguage,
  getByTitle,
} = require("../controller/todoController");
const { checkLogin } = require("../middleware/common");
const Todo = require("../schemas/todoSchema");

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
router.post("/", checkLogin, createTodo);

// create multiple todo
router.post("/bulk",checkLogin, createBulkTodo);

// get all todos
router.get("/", checkLogin, findAll);
// get single todos
router.get("/:id", findSingleTodo);

// uppdate todo (patch)
router.patch("/:id", updateTodoByPatch);

//  update / create (put) //don't work
router.put("/:id", updateTodoByPut);

// delete todo
router.delete("/:id", deleteTodo);

router.delete("/d/delete-all", async (req, res) => {
  await Todo.deleteMany({});
  res.status(200).json("all deleted")
});
// random 3 todo
router.get("/play/random", randomTwoTodo);

// instance
// GET ACTIVE TODOS
router.get("/active", getActiveTodo);

// GET ACTIVE TODOS with callback
router.get("/active-callback", getActiveTodoCB);

// GET ACTIVE TODOS
router.get("/js", getByTitle);

// GET TODOS BY LANGUAGE
router.get("/language", getByLanguage);

module.exports = router;
