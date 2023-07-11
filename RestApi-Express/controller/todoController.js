const Todo = require("../schemas/todoSchema");
const User = require("../schemas/UserSchema");

exports.createTodo = async (req, res) => {
  try {
    // const newTodo = new Todo({ ...req.body, user: req.userId });
     const newTodo = new Todo({
       ...req.body,
       user: req.user._id,
     });
    const result = await newTodo.save();
    await User.updateOne({_id: req.user._id},{
        $push:{
           todos: result._id
        }
    })
    // console.log({newTodo,  id: req.userId});
    res.status(201).json({ message: "Insert Successfully", result });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

exports.createBulkTodo = async (req, res) => {
  try {
    const result = await Todo.insertMany(req.body);
    res.status(201).json({ message: "Bulk Insert Successfully", result });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Todo.find({ status: "active" })
    .populate("user","fullname username -_id")
    .select({
      _id: 0,
      __v: 0,
    });
    res.status(200).json({ data, total: data.length });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

exports.findSingleTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Todo.find({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(`<h1>${err.message}</h1>`);
  }
};

exports.updateTodoByPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const todo = await Todo.find({ _id: id });
    if (!todo) {
      return res.status(404).json({ message: "Todo Not Found" });
    }
    todo.title = req.body.title || todo.title;
    todo.description = req.body.description || todo.description;
    todo.status = req.body.status || todo.status;

    const result = await Todo.findByIdAndUpdate(
      { _id: id },
      { $set: { ...todo } },
      { new: true, useFindAndModify: false }
    );

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(`<h1>${err.message}</h1>`);
  }
};

exports.updateTodoByPut = async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.find({ _id: id });
    console.log(todo.length);
    if (todo.length === 0) {
      // create todo
      const newTodo = new Todo(req.body);
      const result = await newTodo.save();

      res.status(201).json({ message: "Insert Successfully", result });
    } else {
      // update todo  //reference issue otherwise

      todo.title = req.body.title || todo.title;
      todo.description = req.body.description || todo.description;
      todo.status = req.body.status || todo.status;

      const result = await Todo.findByIdAndUpdate(
        { _id: id },
        { $set: { ...todo } },
        { new: true, useFindAndModify: false }
      );
      res.status(201).json({ result, message: "updated!" });
    }

    // res.status(201).json(todo);
  } catch (err) {
    console.log(err);
    res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const id = req.params.id;

    await Todo.findByIdAndDelete({ _id: id });
    res.status(200).send("<h1>Deleted</h1>");
  } catch (err) {
    console.log(err);
    res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
};

exports.randomTwoTodo = async (req, res) => {
  try {
    const data = await Todo.find({ status: "active" }).select({
      __v: 0,
    });

    let result = [];
    let index = 0;
    while (index < 2) {
      const randIndex = Math.floor(Math.random() * data.length);

      if (!result.includes(randIndex)) {
        result.push(randIndex);
        index++;
      }
    }
    const finalTodo = result.map((item) => data[item]);
    // console.log(randIndex);
    res.status(200).json({ result, finalTodo });
  } catch (err) {
    console.log(err);
    res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
}

exports.getActiveTodo = async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json({
    data,
  });
};

exports.getActiveTodoCB = (req, res) => {
  const todo = new Todo();
  todo.findActiveCallback((err, data) => {
    res.status(200).json({
      data,
    });
  });
};

exports.getByTitle = async (req, res) => {
  const data = await Todo.findByJS();
  res.status(200).json({
    data,
  });
};

exports.getByLanguage = async (req, res) => {
  const data = await Todo.find().byLanguage("react");
  res.status(200).json({
    data,
  });
};