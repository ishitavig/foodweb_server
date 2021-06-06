var express = require("express");
const Restaurants = require("../controllers/restaurants");
var router = express.Router();

router.get("/getAll", Restaurants.getAll);

router.post(
  "/tableBooking/:businessId/:customerId",
  Restaurants.createTableBooking
);

router.post("/addMenuItem/:businessId", Restaurants.addMenuItem);

router.put("/updateMenuItem/:businessId/:itemId", Restaurants.updateMenuItem);

router.delete(
  "/deleteMenuItem/:businessId/:itemId",
  Restaurants.deleteMenuItem
);

router.get("/menu/:businessId/getAll", Restaurants.getMenu);

router.get("/getAvailableMenu/:businessId", Restaurants.getAvailableMenu);

router.post(
  "/createFoodOrder/:businessId/:customerId",
  Restaurants.createFoodOrder
);

module.exports = router;
