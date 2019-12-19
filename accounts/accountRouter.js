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

///// ADD ACCOUNT /////
router.post("/", async (req, res, next) => {
  const newAccount = {
    name: req.body.name,
    budget: req.body.budget
  };

  db("accounts")
    .insert(newAccount)
    .then(id => {
      db("accounts")
        .select()
        .orderBy("id", "desc")
        .first()
        .then(account => {
          res.json(account);
        })
        .catch(error => {
          next(error);
        });
    })
    .catch(error => {
      next(error);
    });
});

///// UPDATE ACCOUNT /////
router.put("/:id", async (req, res, next) => {
  const updatedAccount = {
    name: req.body.name,
    budget: req.body.budget
  };

  db("accounts")
    .where("id", req.params.id)
    .update(updatedAccount)
    .then(account => {
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
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
