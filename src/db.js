const { MongoClient } = require('mongodb');

const url = '';
const dbName = 'chatgpt';

let db;

const connectDB = async () => {
  if (db) return db;

  const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  db = client.db(dbName);
  console.log('Connected to MongoDB');
  return db;
};

module.exports = { connectDB };
