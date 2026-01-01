
import {MongoClient} from 'mongodb'
import CONFIG from './config/config.js';

let db;

const mongoClient = new MongoClient(CONFIG.MONGODB_URI);


export const connectionDB=async()=>{
    try {
    await mongoClient.connect()
    db = mongoClient.db();
    console.log('MongoDB connected');
    } catch (err) {
         console.error('MongoDB connection error:', err)
          process.exit(1);
    }
}


export const getDB = () => {
  if (!db) throw new Error("Database not initialized");
  return db;
};