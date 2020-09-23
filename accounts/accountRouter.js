const express = require("express");
const db = require("../data/dbConfig"); // database access using knex

const router = express.Router();

///// GET ACCOUNTS /////
// router.get("/", async (req, res, next) => {
//   db("accounts")
//     .select()
//     .then(accounts => {
//       res.json(accounts);
//     })
//     .catch(error => {
//       next(error);
//     });
// });

router.get("/", async (req, res, next) => {
  function find(query = {}) {
    const { limit = 100, sortby = "id", sortdir = "asc" } = query;

    return db("accounts")
      .orderBy(sortby, sortdir)
      .limit(limit)
      .select();
  }

  const queryOptions = {
    limit: req.query.limit,
    sortby: req.query.sortby,
    sortdir: req.query.sortdir
  };

  try {
    res.json(await find(queryOptions));
  } catch (err) {
    next(err);
  }
});

///// GET ACCOUNT /////
// router.get("/:id", async (req, res, next) => {
//   db("accounts")
//     .select()
//     .where("id", req.params.id)
//     .first()
//     .then(account => {
//       res.json(account);
//     })
//     .catch(error => {
//       next(error);
//     });
// });

router.get("/:id", validateAccountId, async (req, res, next) => {
  try {
    const account = await db("accounts")
      .select()
      .where("id", req.params.id)
      .first();
    res.json(account);
  } catch (err) {
    next(err);
  }
});

///// ADD ACCOUNT /////
// router.post("/", async (req, res, next) => {
//   const newAccount = {
//     name: req.body.name,
//     budget: req.body.budget
//   };

//   db("accounts")
//     .insert(newAccount)
//     .then(id => {
//       db("accounts")
//         .select()
//         .orderBy("id", "desc")
//         .first()
//         .then(account => {
//           res.json(account);
//         })
//         .catch(error => {
//           next(error);
//         });
//     })
//     .catch(error => {
//       next(error);
//     });
// });

router.post("/", validateAccount, async (req, res, next) => {
  try {
    const newAccount = {
      name: req.body.name,
      budget: req.body.budget
    };
    const [id] = await db("accounts").insert(newAccount);
    res.json(
      await db("accounts")
        .where("id", id)
        .first()
    );
  } catch (err) {
    next(err);
  }
});

///// UPDATE ACCOUNT /////
// router.put("/:id", async (req, res, next) => {
//   const updatedAccount = {
//     name: req.body.name,
//     budget: req.body.budget
//   };

//   db("accounts")
//     .where("id", req.params.id)
//     .update(updatedAccount)
//     .then(account => {
//       db("accounts")
//         .select()
//         .where("id", req.params.id)
//         .first()
//         .then(account => {
//           res.json(account);
//         })
//         .catch(error => {
//           next(error);
//         });
//     })
//     .catch(error => {
//       next(error);
//     });
// });

router.put(
  "/:id",
  validateAccountId,
  validateAccount,
  async (req, res, next) => {
    try {
      const updatedAccount = {
        name: req.body.name,
        budget: req.body.budget
      };
      await db("accounts")
        .where("id", req.params.id)
        .update(updatedAccount);
      res.json(
        await db("accounts")
          .where("id", req.params.id)
          .first()
      );
    } catch (err) {
      next(err);
    }
  }
);

///// DELETE ACCOUNT /////
// router.delete("/:id", async (req, res, next) => {
//   db("accounts")
//     .where("id", req.params.id)
//     .del()
//     .then(num => {
//       res.status(204).end();
//     })
//     .catch(error => {
//       next(error);
//     });
// });

router.delete("/:id", validateAccountId, async (req, res, next) => {
  try {
    await db("accounts")
      .where("id", req.params.id)
      .del();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

///// MIDDLEWARE /////
async function validateAccountId(req, res, next) {
  try {
    const account = await db("accounts")
      .where("id", req.params.id)
      .first();
    if (account) {
      next();
    } else {
      res.status(404).json({ message: "Account not found" });
    }
  } catch (err) {
    next(err);
  }
}

async function validateAccount(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "Missing account data" });
  } else if (!req.body.name) {
    return res.status(400).json({ message: "Missing required name field" });
  } else if (!req.body.budget) {
    return res.status(400).json({ message: "missing required budget field" });
  }
  next();
}

module.exports = router;
