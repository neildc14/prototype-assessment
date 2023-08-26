import "./App.css";
import {
  Button,
  Input,
  Box,
  FormControl,
  FormLabel,
  HStack,
  Select,
  Heading,
  Code,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [userText, setUserText] = useState("");
  const [userTexts, setUserTexts] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [backendResponse, setBackendResponse] = useState("");
  console.log(backendResponse);

  const ENDPOINT = "http://localhost:3000/api/fetch-data/";

  useEffect(() => {
    const texts = JSON.parse(localStorage.getItem("userTexts") || "[]");
    setUserTexts(texts);
  }, []);

  const fetchBackendResponse = (e) => {
    e.preventDefault();

    axios
      .get(`${ENDPOINT}`, {
        params: { url: `${userText}` },
      })
      .then((response) => {
        setBackendResponse(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    saveUserText();
  };

  function saveUserText() {
    if (userText.trim() === "") return;

    const updatedTexts = [...userTexts, userText];

    if (updatedTexts.length > 5) {
      updatedTexts.shift();
    }

    localStorage.setItem("userTexts", JSON.stringify(updatedTexts));
    setUserTexts(updatedTexts);
  }

  return (
    <>
      <Box height="100%" width="100%">
        <Box
          as="form"
          display="flex"
          gap="1rem"
          width="100%"
          onSubmit={fetchBackendResponse}
        >
          <FormControl>
            <HStack>
              <FormLabel>URL:</FormLabel>{" "}
              <Input
                type="text"
                width="700px"
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
              />
            </HStack>
          </FormControl>
          <Button type="submit">Query</Button>
        </Box>

        <Select
          mt={10}
          value={selectedText}
          onChange={(e) => {
            setSelectedText(e.target.value);
            setUserText(e.target.value);
          }}
        >
          <option value="">Select Text</option>
          {userTexts.map((text, index) => (
            <option key={index} value={text}>
              {text}
            </option>
          ))}
        </Select>

        <Box
          as="main"
          mt={10}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          gap={2}
        >
          <Box width="50%">
            <Heading as="h2" fontSize="2xl" fontWeight="700" mb={4}>
              URL Response
            </Heading>
            <Code
              width="100%"
              p={4}
              textAlign="start"
              borderRadius="md"
              bg="gray.100"
              fontSize="sm"
              overflowX="scroll"
            >
              {JSON.stringify(backendResponse?.originalResponse)}
            </Code>
          </Box>
          <Box width="50%">
            <Heading as="h2" mb={4} fontSize="2xl" fontWeight="700">
              Processed URL Response
            </Heading>
            <Code
              width="100%"
              p={4}
              textAlign="left"
              borderRadius="md"
              bg="gray.100"
              fontSize="sm"
              overflowX="scroll"
            >
              {JSON.stringify(backendResponse?.processedResponse)}
            </Code>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
