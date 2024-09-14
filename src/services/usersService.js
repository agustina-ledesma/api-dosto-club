import { MongoClient, ObjectId } from "mongodb";
import Jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { SECRET_KEY, JWT_EXPIRES } from "../../index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Definir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { connectToDatabase } from "../db/db.js";
const db = await connectToDatabase();

const usersCollection = db.collection("users");
const userBooksCollection = db.collection("userBooks");
const favoritesCollection = db.collection("favorites");
const highlightsCollection = db.collection("highlights");

async function createUser(user) {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const hashedPassword = await bcryptjs.hash(user.password, 10);
    const newUser = {
      email: user.email,
      password: hashedPassword,
      role: "user",
    };

    const result = await usersCollection.insertOne(newUser);
    newUser._id = result.insertedId;
    const token = Jwt.sign(
      { userId: newUser._id, role: newUser.role },
      SECRET_KEY,
      { expiresIn: JWT_EXPIRES }
    );

    return {
      success: true,
      token,
      user: {
        email: newUser.email,
        _id: newUser._id,
        role: newUser.role,
      },
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

async function login(email, password) {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });

    if (user && bcryptjs.compareSync(password, user.password)) {
      const token = Jwt.sign(
        { userId: user._id, role: user.role },
        SECRET_KEY,
        {
          expiresIn: JWT_EXPIRES,
        }
      );
      return {
        success: true,
        token,
        user: {
          email: user.email,
          _id: user._id,
          role: user.role,
        },
      };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

async function getAllUsers() {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    const users = await usersCollection.find({}).toArray();
    return users;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

async function getUserById(id) {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    return user;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

async function markBookStatus(userId, bookId, status) {
  try {
    const db = await connectToDatabase();
    const userBooksCollection = db.collection("userBooks");

    const userObjectId = new ObjectId(userId);
    const bookObjectId = new ObjectId(bookId);

    const filter = { userId: userObjectId, bookId: bookObjectId };
    const update = { $set: { status } };

    const result = await userBooksCollection.updateOne(filter, update, {
      upsert: true,
    });

    if (result.matchedCount > 0) {
      console.log("Libro actualizado correctamente.");
    } else if (result.upsertedCount > 0) {
      console.log("Nuevo libro agregado correctamente.");
    }
  } catch (error) {
    console.error("Error updating book status:", error);
    throw error;
  } 
}

async function getMarkedBooks(userId) {
  try {
    const db = await connectToDatabase();
    const userBooksCollection = db.collection("userBooks");
    const objectId = new ObjectId(userId);

    const markedBooks = await userBooksCollection
      .find({ userId: objectId })
      .toArray();

    console.log("Fetched marked books:", markedBooks);

    return markedBooks;
  } catch (error) {
    console.error("Error fetching marked books:", error);
    throw error;
  } 
}

async function deleteBook(userId, bookId) {
  try {
    const db = await connectToDatabase();
    const userBooksCollection = db.collection("userBooks");

    const objectUserId = new ObjectId(userId);
    const objectBookId = new ObjectId(bookId);

    const filter = { userId: objectUserId, bookId: objectBookId };

    const result = await userBooksCollection.deleteOne(filter);

    return result;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  } 
}

async function getBookStatus(userId, bookId) {
  try {
  
    const db = await connectToDatabase();
    const userBooksCollection = db.collection("userBooks");

    const userObjectId = new ObjectId(userId);
    const bookObjectId = new ObjectId(bookId);

    // Buscar el estado del libro para el usuario
    const userBook = await userBooksCollection.findOne({
      userId: userObjectId,
      bookId: bookObjectId,
    });

    if (userBook) {
      return userBook.status;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting book status in service:", error);
    throw new Error("Error getting book status");
  }
}

async function getAllFavorites() {
  try {
    const db = await connectToDatabase();
    const favoritesCollection = db.collection("favorites");

    const favorites = await favoritesCollection.find({}).toArray();
    return favorites;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getFavoriteById(id) {
  try {
    const db = await connectToDatabase();
    const favoritesCollection = db.collection("favorites");

    const favorite = await favoritesCollection.findOne({
      _id: new ObjectId(id),
    });
    return favorite;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function addFavorite(userId, bookId) {
  try {

    const db = await connectToDatabase();
    const favoritesCollection = db.collection("favorites");

    const existingFavorite = await favoritesCollection.findOne({
      userId: new ObjectId(userId),
      bookId: new ObjectId(bookId),
    });

    if (existingFavorite) {
      console.log("ya existe");
      return { message: "Favorite already exists" };
    }

    // Si no existe, agregar el nuevo favorito
    const favorite = await favoritesCollection.insertOne({
      userId: new ObjectId(userId),
      bookId: new ObjectId(bookId),
    });

    return favorite;
  } catch (error) {
    console.error("Error al agregar favorito:", error);
  } 
}

async function getFavoriteByUser(userId) {
  try {
    const db = await connectToDatabase();
    const favoritesCollection = db.collection("favorites");

    // Busca todos los favoritos del usuario
    const favorites = await favoritesCollection
      .find({ userId: new ObjectId(userId) })
      .toArray();

    return favorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw new Error("Error interno del servidor");
  } 
}

async function removeFavorite(id) {
  try {
    const db = await connectToDatabase();
    const favoritesCollection = db.collection("favorites");
    const result = await favoritesCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return result;
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
  }
}

async function addHighlight(userId, bookId, highlightData) {
  try {
    const db = await connectToDatabase();
    const highlightsCollection = db.collection("highlights");

    highlightData._id = new ObjectId();

    const existingHighlight = await highlightsCollection.findOne({
      userId: new ObjectId(userId),
      bookId: new ObjectId(bookId),
    });

    if (existingHighlight) {
      await highlightsCollection.updateOne(
        { _id: existingHighlight._id },
        { $push: { highlights: highlightData } }
      );
    } else {
      const highlight = {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        bookId: new ObjectId(bookId),
        highlights: [highlightData],
      };

      await highlightsCollection.insertOne(highlight);
    }
    return highlightData;
  } catch (error) {
    throw new Error(`Error adding highlight: ${error.message}`);
  }
}

async function getHighlights(userId, bookId) {
  try {
    const db = await connectToDatabase();
    const highlightsCollection = db.collection("highlights");

    const highlights = await highlightsCollection
      .find({
        userId: new ObjectId(userId),
        bookId: new ObjectId(bookId),
      })
      .toArray();

    return highlights;
  } catch (error) {
    throw new Error(`Error fetching highlights: ${error.message}`);
  }
}

async function getHighlightsByUser(userId) {
  try {

    const db = await connectToDatabase();
    const highlightsCollection = db.collection("highlights");

    const highlights = await highlightsCollection
      .find({
        userId: new ObjectId(userId),
      })
      .toArray();

    return highlights;
  } catch (error) {
    throw new Error(`Error fetching highlights: ${error.message}`);
  }
}

async function updateProfile(userId, updateUser) {
  try {

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) }, // Convierte el userId a ObjectId
      { $set: updateUser }, // Actualiza solo los campos proporcionados
      { returnOriginal: false } // Devuelve el documento actualizado
    );

    return result.value; // Devuelve el usuario actualizado
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    throw new Error("Error al actualizar el perfil");
  }
}

async function removeUserImageService(userId) {
  try {
    
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    if (!ObjectId.isValid(userId)) {
      return {
        success: false,
        statusCode: 400,
        message: "ID de usuario no válido",
      };
    }
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return {
        success: false,
        statusCode: 404,
        message: "Usuario no encontrado",
      };
    }

    if (user.image) {
      const imagePath = path.resolve("src", user.image);

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error al eliminar la imagen:", err);
        } else {
          console.log("Imagen eliminada correctamente");
        }
      });

      // Actualizar el campo 'image' a null
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { image: null } }
      );

      return { success: true, message: "Imagen eliminada y campo actualizado" };
    } else {
      return {
        success: false,
        statusCode: 400,
        message: "No hay imagen para eliminar",
      };
    }
  } catch (error) {
    console.error("Error al eliminar la imagen en el servicio:", error);
    return { success: false, statusCode: 500, message: "Error del servidor" };
  }
}

export {
  createUser,
  login,
  getUserById,
  getAllUsers,
  markBookStatus,
  getMarkedBooks,
  deleteBook,
  getBookStatus,
  getAllFavorites,
  addFavorite,
  getFavoriteByUser,
  getFavoriteById,
  removeFavorite,
  addHighlight,
  getHighlights,
  getHighlightsByUser,
  updateProfile,
  removeUserImageService,
};
