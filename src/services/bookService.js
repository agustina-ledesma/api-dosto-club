import { connectToDatabase } from "../db/db.js";
import { MongoClient, ObjectId } from "mongodb"
const db = await connectToDatabase();

const bookCollection = db.collection("books");
import fs from "fs";
import path from "path";
const UPLOAD_DIR = "uploads"; 


if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

async function getAllBooks() {
  try {
    const db = await connectToDatabase();
    const bookCollection = db.collection("books");
    const books = await bookCollection.find({}).toArray();
    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

async function getBookById(id) {
  try {
    const db = await connectToDatabase();
    const bookCollection = db.collection("books");
    const book = await bookCollection.findOne({ _id: new ObjectId(id) });
    return book;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

async function createBook(newBook) {
  try {
    const db = await connectToDatabase();
    const bookCollection = db.collection("books");
    const bookWithId = { _id: new ObjectId(), ...newBook };
    await bookCollection.insertOne(bookWithId);

    return bookWithId;
  } catch {
    console.error("Error:", error);
    throw error;
  }
}

async function editBook(bookId, updatedBook) {
  try {
    const db = await connectToDatabase();
    const bookCollection = db.collection("books");

    const result = await bookCollection.updateOne(
      { _id: new ObjectId(bookId) },
      { $set: updatedBook }
    );

    return result;
  } catch {
    console.error("Error:", error);
    throw error;
  }
}

async function deleteBook(bookId) {
  try {
    const db = await connectToDatabase();
    const bookCollection = db.collection("books");
    const result = await bookCollection.deleteOne({
      _id: new ObjectId(bookId),
    });

    if (result.deletedCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch {
    console.error("Error:", error);
    throw error;
  }
}

export { getAllBooks, getBookById, createBook, editBook, deleteBook };
