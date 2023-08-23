const express = require("express");
const router = express.Router();

//all
router.get("/", (req, res) => {
  res.json({ message: "all" });
});

//specific
router.get("/:id", (req, res) => {
  res.json({ message: "specific" });
});

//post
router.post("/", (req, res) => {});

//update
router.put("/:id", (req, res) => {});

//delete
router.delete("/:id", (req, res) => {});

module.exports = router;
