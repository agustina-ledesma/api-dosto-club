import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.DB_URI;
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db("dosto_club");
      console.log("Connected to database");
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  }
  return db;
}

export { connectToDatabase };
