const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const shortid = require("shortid");
const path = require("path");
const { writeFile } = require("fs");

// varaible
const dbPath = path.join(__dirname + "/../data/data.json");
// const dbPath = path.resolve("routes", "../data/data.json");

router.get("/", async (req, res) => {
  try {
    res.status(200).send("<h1>Hello Nahid</h1>");
  } catch (err) {
    console.log(err);
    res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
});

// create player
router.post("/", async (req, res) => {
  try {
    const player = { ...req.body, id: shortid.generate() };
    const data = await fs.readFile(dbPath);
    const players = JSON.parse(data);
    players.push(player);
    await fs.writeFile(dbPath, JSON.stringify(players));
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});
// get all player
router.get("/all", async (req, res) => {
  try {
    const data = await fs.readFile(dbPath);
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});
// get single player
router.get("/:playerId", async (req, res) => {
  try {
    const id = req.params.playerId;
    const data = await fs.readFile(dbPath);
    const players = JSON.parse(data);
    let player = players.find((obj) => id === obj.id);
    player = player !== undefined ? player : "Player can't find";
    console.log(player);
    res.status(200).send(player);
  } catch (err) {
    console.log(err);
    res.status(500).send(`<h1>${err.message}</h1>`);
  }
});

// uppdate player (patch)
router.patch("/:playerId", async (req, res) => {
  try {
    const id = req.params.playerId;
    const data = await fs.readFile(dbPath);
    const players = JSON.parse(data);
    let player = players.find((obj) => id === obj.id);

    if (!player) {
      return res.status(404).send({ message: "Player Not Found" });
    }

    player.name = req.body.name || player.name;
    player.country = req.body.country || player.country;
    player.rank = req.body.rank || player.rank;

    // console.log(players)
    await fs.writeFile(dbPath, JSON.stringify(players));
    res.status(201).send(player);
  } catch (err) {
    console.log(err);
    res.status(500).send(`<h1>${err.message}</h1>`);
  }
});

//  update / create (put)
router.put("/:playerId", async (req, res) => {
  try {
    const id = req.params.playerId;
    const data = await fs.readFile(dbPath);
    const players = JSON.parse(data);
    let player = players.find((obj) => id === obj.id);

    if (!player) {
      // create player
      player = {
        id: shortid.generate(),
        ...req.body,
      };
      players.push(player);
    } else {
      // update player

      player.name = req.body.name;
      player.country = req.body.country;
      player.rank = req.body.rank;
    }
    await fs.writeFile(dbPath, JSON.stringify(players));
    res.status(201).send(player);
  } catch (err) {
    console.log(err);
    res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
});

// delete player
router.delete("/:playerId", async (req, res) => {
  try {
      const id = req.params.playerId;
      const data = await fs.readFile(dbPath);
      const players = JSON.parse(data);
      let player = players.find((obj) => id === obj.id);

      if (!player) {
        return res.status(404).send({ message: "Player Not Found" });
      }
    const newPlayers = players.filter(p => p.id !== id)
    await fs.writeFile(dbPath, JSON.stringify(newPlayers))

    res.status(200).send("<h1>Deleted</h1>");
  } catch (err) {
    console.log(err);
    res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
});
module.exports = router;
