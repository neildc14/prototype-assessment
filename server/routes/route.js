const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post(process.env.RESOURCE_URI, async (req, res) => {
  const { url } = req.body;
  try {
    const decodedURLResponse = decodeURIComponent(url);

    const resource_response = await axios.get(decodedURLResponse);
    console.log(resource_response.data);
    res.status(200).json(resource_response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data from the API" });
  }
});

module.exports = router;
