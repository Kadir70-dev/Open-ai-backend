const openai = require('./openaiClient');
const { sleep } = require('./utils');
const { connectDB } = require('./db');

async function retrieveRun(threadId, runId, userInput) {
  // Parse user input to extract relevant parameters
  const params = await parseUserInput(userInput);

  while (true) {
    console.log(`Retrieving run status for thread ${threadId}, run ${runId}...`);
    const keepRetrievingRun = await openai.beta.threads.runs.retrieve(
      threadId,
      runId
    );
    console.log("Run status:", keepRetrievingRun.status);

    if (keepRetrievingRun.status === 'completed') {
      console.log("Run completed. Retrieving messages...");
      const allMessages = await openai.beta.threads.messages.list(threadId);
      console.log("Assistant messages retrieved:", allMessages.data);
      const response = allMessages.data[0].content[0].text.value;

      // Save parameters and response to MongoDB
      const db = await connectDB();
      await db.collection('messages').insertOne({
        // threadId,
        // runId,
        // userInput,
        ...params,
        // response,
        timestamp: new Date(),
      });

      return response;
    } else if (
      keepRetrievingRun.status === 'queued' ||
      keepRetrievingRun.status === 'in_progress'
    ) {
      console.log("Run queued or in progress. Waiting before next retrieval...");
      await sleep(5000);
    } else {
      console.log("Run status not in progress or queued, breaking loop.");
      break;
    }
  }
}

async function parseUserInput(userInput) {
  const params = await parseMessage(userInput);
  return params;
}
// Define functions to extract individual parameters from user input
async function extractApartmentType(userInput) {
  const keywords = ['1 BHK', '2 BHK', '3 BHK']; // Define keywords for different apartment types

  // Search for keywords in the user input
  for (const keyword of keywords) {
    if (userInput.includes(keyword)) {
      return keyword; // Return the matched keyword as the apartment type
    }
  }

  // If no keyword is found, return a default value or handle accordingly
  return 'Unknown'; // Default value if apartment type is not specified
}

async function extractFurnishingStatus(userInput) {
  const keywords = ['furnished', 'semi-furnished', 'unfurnished']; // Define keywords for different furnishing statuses

  // Search for keywords in the user input
  for (const keyword of keywords) {
    if (userInput.includes(keyword)) {
      return keyword; // Return the matched keyword as the furnishing status
    }
  }

  // If no keyword is found, return a default value or handle accordingly
  return 'Unknown'; // Default value if furnishing status is not specified
}

async function extractLocation(userInput) {
  // Logic to extract location from userInput can vary widely based on expected input format
  // Example: Extracting location based on predefined areas or neighborhoods
  // For simplicity, let's assume the location is mentioned after the keyword "located in"
  const locatedIndex = userInput.indexOf('located in');
  if (locatedIndex !== -1) {
    return userInput.slice(locatedIndex + 'located in'.length).trim();
  } else {
    return 'Unknown'; // Default value if location is not specified
  }
}

async function extractDeposit(userInput) {
  // Logic to extract deposit from userInput can vary based on expected input format
  // Example: Extracting deposit amount based on patterns like "deposit of {amount}"
  const depositRegex = /deposit\s+of\s+(\d+)\s+lakh/i;
  const match = userInput.match(depositRegex);
  if (match) {
    return parseInt(match[1]); // Extracted deposit amount
  } else {
    return 0; // Default value if deposit is not specified
  }
}

async function extractRent(userInput) {
  // Logic to extract rent from userInput can vary based on expected input format
  // Example: Extracting rent amount based on patterns like "rent of {amount}"
  const rentRegex = /rent\s+of\s+(\d+)\s+lakh/i;
  const match = userInput.match(rentRegex);
  if (match) {
    return parseInt(match[1]); // Extracted rent amount
  } else {
    return 0; // Default value if rent is not specified
  }
}
function parseMessage(message) {
  const regex = /(\d+)\s*BHK.*?(furnished|semi furnished|unfurnished).*?located in\s*([\w\s]+).*?rent of\s*(\d+)\s*lakh.*?deposit of\s*(\d+)\s*lakh/i;
  const match = message.match(regex);
  if (match) {
    const params = {
      apartment: match[1],
      furnishing: match[2],
      location: match[3],
      rent: parseInt(match[4]),
      deposit: parseInt(match[5])
    };
    return params;
  } else {
    return null;
  }
}  

async function getAssistantInstructions(assistantId) {
  console.log("Retrieving assistant instructions...");
  const assistantConfig = await openai.beta.assistants.retrieve(assistantId);
  console.log("Assistant instructions retrieved:", assistantConfig);
  return assistantConfig.instructions;
}


module.exports = {
  retrieveRun,
  getAssistantInstructions,
};
