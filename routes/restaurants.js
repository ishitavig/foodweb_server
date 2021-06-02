var express = require("express");
const Restaurants = require("../controllers/restaurants");
var router = express.Router();

router.get("/getAll", Restaurants.getAll);

module.exports = router;
