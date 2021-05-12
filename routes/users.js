var express = require("express");
const Users = require("../controllers/users");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json("respond with a resource");
});

router.post("/signup", Users.signup);

module.exports = router;
