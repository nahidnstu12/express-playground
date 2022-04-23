const ticketCollection = require("../model/TicketCollection");

exports.sellSingleTicket = (req, res) => {
  try {
    const { username, price } = req.body;
    const ticket = ticketCollection.create(username, price);
    res.status(201).json({ message: "Ticket Created Successfully", ticket });
  } catch (err) {
    console.log(err);
    // res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
};

exports.sellBulkTicket = (req, res) => {
  try {
    const { username, price, quantity } = req.body;
    const tickets = ticketCollection.createBulk(username, price, quantity);
    res.status(201).json({ message: "Ticket Created Successfully", tickets });
  } catch (err) {
    console.log(err);
    // res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
};

exports.getAllTickets = (req, res) => {
  try {
    const tickets = ticketCollection.findAll();
    res.status(200).json({ items: tickets, total: tickets.length });
  } catch (err) {
    console.log(err);
    // res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
};

exports.getTicketById = (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id)
    const ticket = ticketCollection.findById(id);
    console.log(ticket)
    if (!ticket) {
      return res.status(404).send({ message: "<h1>404 Not Found</h1>" });
    }
    res.status(200).json({ ticket });
  } catch (err) {
    console.log(err);
    // res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
};
exports.getTicketsByUsername = (req, res) => {
  try {
    const username = req.params.username;
    const tickets = ticketCollection.findByUsername(username);
    if (!tickets) {
      return res.status(404).json({ message: "<h1>404 Not Found</h1>" });
    }
    res.status(200).json({ items: tickets, total: tickets.length });
  } catch (err) {
    console.log(err);
    // res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
};

exports.updateTicketById = (req, res) => {
  try {
    const id = req.params.id;

    const ticket = ticketCollection.updateById(id, req.body);
    res.status(200).json({ message: "Ticket Updated Successfully", ticket });
  } catch (err) {
    console.log(err);
    // res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
};

exports.updateTicketByUsername = (req, res) => {
  try {
    const username = req.params.username;

    const tickets = ticketCollection.updatedBulk(username, req.body);
    if (!tickets) {
      return res.status(404).json({ message: "<h1>404 Not Found</h1>" });
    }
    res.status(200).json({ message: "Ticket Updated Successfully", tickets });
  } catch (err) {
    console.log(err);
    // res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
};

exports.deleteTicketById = (req, res) => {
  try {
    const id = req.params.id;

    const ticket = ticketCollection.deleteById(id);
    console.log(ticket)

    if (!ticket) {
      return res
        .status(400)
        .json({ message: "<h1>Delete Operation failed</h1>" });
    }
    res.status(204).json({ message: "Ticket Deleted Successfully", ticket });
  } catch (err) {
    console.log(err);
    // res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
};

exports.deleteTicketByUsername = (req, res) => {
  try {
    const username = req.params.username;

    ticketCollection.deleteBulk(username);
    res.status(200).json({ message: "Bulk Ticket Deleted Successfully"});
  } catch (err) {
    console.log(err);
    // res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
};

exports.raffleDraw = (req, res) => {
  try {
    const wc = req.query.wc ?? 3;

    const winners = ticketCollection.draw(wc);
    res.status(200).json({ items: winners, total: winners.length });
  } catch (err) {
    console.log(err);
    // res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
};
