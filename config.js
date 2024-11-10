const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config(); 
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db; 

const connectDB = async () => {
  try {
    if (!uri || !dbName) {
      console.error('Faltan variables de entorno: MONGODB_URI o MONGODB_DATABASE');
      process.exit(1);
    }

    await client.connect();
    db = client.db(dbName); 
    console.log(`Conectado a la base de datos: ${db.databaseName}`);
  } catch (err) {
    console.error('Error conectando a la base de datos:', err.message);
    process.exit(1); 
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('La base de datos no está inicializada. Llama a connectDB primero.');
  }
  return db;
};

module.exports = { connectDB, getDB };
