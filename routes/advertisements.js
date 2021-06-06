var express = require("express");
const Advertisements = require("../controllers/advertisements");
var router = express.Router();

router.get("/getAdPlans", Advertisements.getAdPlans);

router.post("/purchasePlan/:businessId/:planId", Advertisements.purchasePlan);

router.post("/create/:businessId", Advertisements.create);

router.get(
  "/getAdsByBusinessId/:businessId",
  Advertisements.getAdsByBusinessId
);

router.put("/update/:businessId/:adId", Advertisements.update);

router.delete("/delete/:businessId/:adId", Advertisements.delete);

router.get("/getAllAds", Advertisements.getAllAds);

module.exports = router;
