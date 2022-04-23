const fs = require("fs/promises");
const path = require("path");
const dbPath = path.join(__dirname + "/../data/raffleData.json");

/**
 * read a file
 * @returns {object} data
 */
exports.readFile = async () => {
  try {
    const data = await fs.readFile(dbPath);
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

/**
 * write a file
 * @param {object} data 
 */
exports.writeFile = async (data) => {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data));
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};
