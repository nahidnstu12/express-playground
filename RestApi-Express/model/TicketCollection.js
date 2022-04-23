const { readFile, writeFile } = require("../lib/utils");
const Ticket = require("./Ticket");

const tickets = Symbol("tickets");
class TicketCollection {
  constructor() {
    (async function () {
      this[tickets] = await readFile();
    }.call(this));
  }
  /**
   * create a single ticket
   * @param {string} username
   * @param {number} price
   * @returns {Ticket} ticket
   */
  create(username, price) {
    const ticket = new Ticket(username, price);
    this[tickets].push(ticket);
    writeFile(this[tickets]);
    return ticket;
  }
  /**
   * create bulk tickets
   * @param {string} username
   * @param {number} price
   * @param {number} quantity
   * @returns {Ticket[]}
   */
  createBulk(username, price, quantity) {
    const res = [];
    for (let i = 0; i < quantity; i++) {
      res.push(this.create(username, price));
    }
    writeFile(this[tickets]);
    return res;
  }
  /**
   * find all available tickets
   * @returns {tickets} ticket
   */
  findAll() {
    return this[tickets];
  }
  /**
   * get ticket by id
   * @param {string} ticketId
   * @returns {Ticket}
   */
  findById(ticketId) {
    return this[tickets].find(
      /**
       * @param {Ticket} ticket
       */
      (ticket) => ticket.id === ticketId
    );
  }
  /**
   * get all tickets by username
   * @param {string} username
   * @returns {Ticket[]} userTickets
   */
  findByUsername(username) {
    const userTickets = this[tickets].filter(
      (ticket) => ticket.username === username
    );
    return userTickets;
  }
  /**
   * upddate single ticket by id
   * @param {string} ticketId
   * @param {{username:string, price:number}} ticketBody
   */
  updateById(ticketId, ticketBody) {
    const ticket = this.findById(ticketId);
    if (ticket) {
      ticket.username = ticketBody.username ?? ticket.username;
      ticket.price = ticketBody.price ?? ticket.price;
    }
    writeFile(this[tickets]);
    return ticket;
  }
  /**
   * Update ticket bulk
   * @param {string} ticketId
   * @param {{username:string, price:number}} ticketBody
   */
  updatedBulk(username, ticketBody) {
    const userTickets = this.findByUsername(username);
    if (userTickets) {
      const updatedTickets = userTickets.map((ticket) =>
        this.updateById(ticket.id, ticketBody)
      );
       writeFile(this[tickets]);
      return updatedTickets;
    } else {
      return false;
    }
  }
  /**
   * delete single ticket by id
   * @param {string} ticketId
   * @returns {boolean}
   */
  deleteById(ticketId) {
    const index = this[tickets].findIndex((ticket) => ticket.id === ticketId);
    if (index === -1) {
      return false;
    } else {
      this[tickets].splice(index, 1);
      writeFile(this[tickets]);
      return true;
    }
  }
  /**
   * Delete Bulk
   * @param {string} username
   * @returns {boolean[]}
   */
  deleteBulk(username) {
    const userTickets = this.findByUsername(username);
    const tickets = userTickets.map((ticket) => this.deleteById(ticket.id));
    writeFile(this[tickets]);
    return tickets;
  }
  /**
   * find winner
   * @param {number} winnerCount
   * @returns {array}
   */
  draw(winnerCount) {
    let winnerIndexs = new Array(winnerCount);

    let winnerIndex = 0;
    while (winnerCount > winnerIndex) {
      let ticketIndex = Math.floor(Math.random() * this[tickets].length);
      if (!winnerIndexs.includes(ticketIndex)) {
        winnerIndexs[winnerIndex++] = ticketIndex;
        continue;
      }
    }
    return winnerIndexs.map((index) => this[tickets][index]);
  }
}

const ticketCollection = new TicketCollection();
module.exports = ticketCollection;
