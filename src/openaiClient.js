
const OpenAI = require('openai');

const apiKey = 'sk-proj-biOewhQZXCc3kVDTFtOBT3BlbkFJrjVbZKpTw7hRYP05rVZc';

const openai = new OpenAI({
  apiKey: apiKey,
});

module.exports = openai;
