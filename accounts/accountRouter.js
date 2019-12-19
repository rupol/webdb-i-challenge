const express = require("express");
const db = require("../data/dbConfig"); // database access using knex

const router = express.Router();

///// GET ACCOUNTS /////
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

///// GET ACCOUNT /////
router.get("/:id", async (req, res, next) => {
  db("accounts")
    .select()
    .where("id", req.params.id)
    .first()
    .then(account => {
      res.json(account);
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
