var express = require("express");
const Users = require("../controllers/users");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json("respond with a resource");
});

router.post("/customer/signup", Users.customerSignUp);

router.post("/customer/signin", Users.customerSignIn);

router.post("/business/signup", Users.businessSignUp);

router.post("/business/signin", Users.businessSignIn);

router.put("/:userType/:userId", Users.updateUser);

router.get("/:userType/:userId", Users.getUserById);

router.post("/search-restaurants", Users.searchRestaurants);

router.post("/:userType/forgotPassword", Users.forgotPasswordEmail);

router.put("/:userType/resetPassword", Users.resetPassword);

module.exports = router;
