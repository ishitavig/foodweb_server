var express = require("express");
const Blogs = require("../controllers/blogs");
var router = express.Router();

router.post("/create", Blogs.create);

router.get("/getAll", Blogs.getAll);

module.exports = router;
