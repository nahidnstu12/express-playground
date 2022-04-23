var express = require("express");
const {
  getAllTickets,
  sellSingleTicket,
  getTicketById,
  updateTicketById,
  deleteTicketById,
  getTicketsByUsername,
  updateTicketByUsername,
  deleteTicketByUsername,
  sellBulkTicket,
  raffleDraw,
} = require("../controller/raffleController");
var router = express.Router();

//
router.route("/").get(getAllTickets).post(sellSingleTicket);
// by id
router
  .route("/t/:id")
  .get(getTicketById)
  .put(updateTicketById)
  .delete(deleteTicketById);
// by username
router
  .route("/u/:username")
  .get(getTicketsByUsername)
  .put(updateTicketByUsername)
  .delete(deleteTicketByUsername);

router.get("/draw", raffleDraw);
router.post("/bulk", sellBulkTicket);

module.exports = router;
