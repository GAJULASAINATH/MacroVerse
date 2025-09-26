const express = require("express");
const router = express.Router();
const { analyzeFoodImage } = require("../controllers/analyzeFoodImage");
const { getMonthlyReport } = require("../controllers/getMonthlyReport");

router.post("/analyzeFoodImage", analyzeFoodImage);
router.post("/getMonthlyReport", getMonthlyReport);

module.exports = router;