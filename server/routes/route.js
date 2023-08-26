const express = require("express");
const router = express.Router();
const axios = require("axios");

function countCharacters(input, char) {
  return input.split("").filter((c) => c === char).length;
}

function sortDescending(input) {
  if (typeof input !== "string") {
    input = String(input);
  }
  return input
    .split("")
    .sort((a, b) => b.localeCompare(a))
    .join("");
}

router.get("/fetch-data", async (req, res) => {
  const { url } = req.query;

  try {
    const response = await axios.get(url);

    const responseData = response.data;

    function processObject(obj) {
      const result = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const sortedKey = sortDescending(key); // Sort key string
          if (typeof obj[key] === "string") {
            result[sortedKey] = {
              countE: countCharacters(key, "e") + countCharacters(key, "E"),
              value: sortDescending(obj[key]), // Sort value string
            };
          } else if (typeof obj[key] === "boolean") {
            result[sortedKey] = obj[key];
          } else if (Array.isArray(obj[key])) {
            result[sortedKey] = obj[key].map((item) => processObject(item));
          } else if (typeof obj[key] === "object") {
            result[sortedKey] = processObject(obj[key]);
          }
        }
      }
      return result;
    }

    const processedResponse = processObject(responseData);

    // Count 'e' and 'E' characters in the top level keys
    const totalECount =
      countCharacters(JSON.stringify(processedResponse), "e") +
      countCharacters(JSON.stringify(processedResponse), "E");

    // Prepare the response
    const finalProcessedData = {
      originalResponse: responseData,
      processedResponse: {
        countE: totalECount,
        ...processedResponse,
      },
    };

    res.status(200).json(finalProcessedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data from the API" });
  }
});

module.exports = router;
