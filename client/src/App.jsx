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

  const LOCAL_STORAGE_NAME = "userTexts";

  useEffect(() => {
    const savedTexts = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_NAME) || "[]"
    );
    setUserTexts(savedTexts);
  }, []);

  const fetchBackendResponse = (query_event) => {
    query_event.preventDefault();

    axios
      .post(`${import.meta.env.VITE_RESOURCE_ENDPOINT}`, {
        url: encodeURIComponent(`${userText}`),
      })
      .then((resource_response) => {
        setBackendResponse(resource_response.data);
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

    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(updatedTexts));
    setUserTexts(updatedTexts);
  }

  return (
    <>
      <Box height="100%" width="80%" mx="auto" py={8}>
        <Box
          as="form"
          display="flex"
          justifyContent="flex-start"
          gap="2rem"
          onSubmit={fetchBackendResponse}
        >
          <FormControl>
            <HStack>
              <FormLabel>URL:</FormLabel>{" "}
              <Input
                type="text"
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
              />
            </HStack>
          </FormControl>
          <Button
            type="submit"
            bgColor="blue.500"
            color="white"
            _hover={{ bgColor: "blue.600" }}
          >
            Query
          </Button>
        </Box>

        <Select
          mt={10}
          value={selectedText}
          onChange={(query_text) => {
            setSelectedText(query_text.target.value);
            setUserText(query_text.target.value);
          }}
        >
          <option value="">Saved Texts</option>
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
              minHeight="20rem"
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
              minHeight="20rem"
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
