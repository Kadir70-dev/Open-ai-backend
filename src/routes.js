const express = require('express');
const { retrieveRun, getAssistantInstructions } = require('./assistantService');
const openai = require('./openaiClient');
const { sleep } = require('./utils');
const { connectDB } = require('./db');

const router = express.Router();

const assistantId = process.env.assistantId;

router.post('/message', async (req, res) => {
  try {
    const userInput = req.body.message;
    console.log("Received user input:", userInput);

    // Save user input to MongoDB
    const db = await connectDB();
    const userMessage = await db.collection('messages').insertOne({
      message: userInput,
      timestamp: new Date(),
    });

    console.log("Creating a new thread...");
    const myThread = await openai.beta.threads.create();
    console.log("Thread created:", myThread.id);

    console.log("Retrieving assistant instructions...");
    const instructions = await getAssistantInstructions(assistantId);
    console.log("Instructions retrieved:", instructions);

    console.log("Adding user message to thread...");
    const myThreadMessage = await openai.beta.threads.messages.create(
      myThread.id,
      {
        role: 'user',
        content: userInput,
      }
    );
    console.log("User message added:", myThreadMessage);

    console.log("Creating assistant run...");
    const myRun = await openai.beta.threads.runs.create(myThread.id, {
      assistant_id: assistantId,
      instructions: instructions,
    });
    console.log("Assistant run created:", myRun);

    console.log("Waiting for 15 seconds before retrieving run status...");
    await sleep(15000);

    console.log("Retrieving run status...");
    const assistantResponse = await retrieveRun(myThread.id, myRun.id,userInput);
    console.log("Assistant response received:", assistantResponse);

    res.json({ response: assistantResponse });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
