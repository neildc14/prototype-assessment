const axios = require("axios");

const postResource = async (req, res) => {
  const { url } = req.body;
  try {
    const decodedResponse = decodeURIComponent(url);

    function isValidURL(decodedString) {
      try {
        new URL(decodedString);
        return true;
      } catch (error) {
        return false;
      }
    }

    async function fetchResponse(response) {
      if (isValidURL(response)) {
        const url_response = await axios.get(response);
        const response_data = url_response.data;
        return response_data;
      } else {
        return response;
      }
    }

    const originalResponse = await fetchResponse(decodedResponse);

    function makeDuplicateResponse(originalResponse) {
      let duplcateResponse = JSON.parse(JSON.stringify(originalResponse));
      return duplcateResponse;
    }

    function countLetterEOnKeys(duplicateResponse) {
      if (typeof duplicateResponse !== "object") {
        return duplicateResponse;
      }
      let countedEObject = duplicateResponse;
      for (let [key, value] of Object.entries(countedEObject)) {
        if (key.toLowerCase().includes("e")) {
          countedEObject["countE"]
            ? countedEObject["countE"]++
            : (countedEObject["countE"] = 1);
        }

        if (typeof value === "object") {
          countLetterEOnKeys(countedEObject[key]);
        }
      }

      return countedEObject;
    }

    function sortKeyString(input) {
      const upperCaseLetters = input.match(/[A-Z]/g) || [];
      const lowerCaseLetters = input.match(/[a-z]/g) || [];
      const numbers = input.match(/\d/g) || [];

      const sortedKeyString =
        upperCaseLetters.sort((a, b) => b.localeCompare(a)).join("") +
        lowerCaseLetters.sort((a, b) => b.localeCompare(a)).join("") +
        numbers.sort((a, b) => b.localeCompare(a)).join("");

      return sortedKeyString;
    }

    function sortKeyValues(objectToSortKeyValues) {
      if (Array.isArray(objectToSortKeyValues)) {
        return objectToSortKeyValues.map((item) => sortKeyValues(item)).sort();
      } else if (
        typeof objectToSortKeyValues === "object" &&
        objectToSortKeyValues !== null
      ) {
        const sortedObj = {};
        for (const [key, value] of Object.entries(objectToSortKeyValues)) {
          const sortedKey = sortKeyString(key);
          sortedObj[sortedKey] = sortKeyValues(value);
        }
        return sortedObj;
      } else if (typeof objectToSortKeyValues === "string") {
        return objectToSortKeyValues.split("").sort().join("");
      } else {
        return objectToSortKeyValues;
      }
    }

    const duplicateResponse = makeDuplicateResponse(originalResponse);
    const sortedKeyResponse = sortKeyValues(duplicateResponse);
    const processedResponse = countLetterEOnKeys(sortedKeyResponse);

    const all_url_response = {
      originalResponse: originalResponse,
      processedResponse: processedResponse,
    };

    res.status(200).json(all_url_response);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data from the API" });
  }
};

module.exports = postResource;
