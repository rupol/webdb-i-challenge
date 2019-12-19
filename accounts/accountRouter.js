const express = require("express");
const db = require("../data/dbConfig"); // database access using knex

const router = express.Router();

router.get("/", async (req, res, next) => {
  db("accounts")
    .select()
    .then(accounts => {
      res.json(accounts);
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
