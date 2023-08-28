const express = require("express");
const router = express.Router();
const postResource = require("../controllers/resourceController");
router.post(process.env.RESOURCE_URI, postResource);

module.exports = router;
