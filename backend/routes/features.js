const express = require("express");
const router = express.Router();
const { analyzeFoodImage } = require("../controllers/analyzeFoodImage");

router.post("/analyzeFoodImage", analyzeFoodImage);

module.exports = router;