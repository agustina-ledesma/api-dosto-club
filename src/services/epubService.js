import { connectToDatabase } from "../db/db.js";
import { MongoClient, ObjectId } from "mongodb"
const db = await connectToDatabase();
const epubCollection = db.collection("epubs");

async function getAllEpubs() {
  try {
    const db = await connectToDatabase();
    const epubCollection = db.collection("epubs");
    const epub = await epubCollection.find({}).toArray();
    return epub;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

async function getEpubById(id) {
  try {
    const db = await connectToDatabase();
    const epubCollection = db.collection("epubs");
    const epub = await epubCollection.findOne({ _id: new ObjectId(id) });
    return epub;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function uploadEpub(bookId, epubData) {
  try {
    const db = await connectToDatabase();
    const epubCollection = db.collection("epubs");
    const newEpub = {
      bookId: new ObjectId(bookId),
      ...epubData, // Incluye cualquier otro dato que necesites almacenar
    };

    const result = await epubCollection.insertOne(newEpub);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getEpubByBookId(bookId) {
  try {
    const db = await connectToDatabase();
    const epubCollection = db.collection("epubs");

    if (!ObjectId.isValid(bookId)) {
      throw new Error("Invalid bookId");
    }

    const epub = await epubCollection.findOne({ bookId: new ObjectId(bookId) });
    return epub;
  } catch {
    console.error("Error:", error);
    throw error;
  }
}

async function deleteEpub(id) {
  try {
    const db = await connectToDatabase();
    const epubCollection = db.collection("epubs");
    const result = await epubCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export { getAllEpubs, getEpubById, uploadEpub, getEpubByBookId, deleteEpub };
