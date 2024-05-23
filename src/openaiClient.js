
const OpenAI = require('openai');


const openai = OpenAI(process.env.apiKey);

module.exports = openai;
