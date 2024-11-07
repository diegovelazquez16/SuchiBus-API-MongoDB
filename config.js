const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
console.log(uri);
const client = new MongoClient(uri);

let db;


const connectDB = async () => {
  try {
    await client.connect();
    db = client.db('suchibus_dev');
    console.log('Conectado a la base de datos');    
  } catch (err) {
    console.error('Error conectando a la base de datos:', err);
    process.exit(1); 
  }
};

const getDB = () => db;
module.exports = { connectDB, getDB };
