import * as usersService from "../services/usersService.js";
import multer from "multer";
import path from "path";
import fs from "fs";

export async function createUser(req, res) {
  const user = req.body;

  try {
    const result = await usersService.createUser(user);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error durante la creación de usuario:", error.message);
    res.status(500).json({
      success: false,
      message: "Error durante la creación de usuario.",
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const result = await usersService.login(email, password);

    if (result.success) {
      console.log("User object:", result.user);
      res.json({
        token: result.token,
        user: {
          email: result.user.email,
          _id: result.user._id,
          role: result.user.role,
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error en iniciar sesión." });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await usersService.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: " not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching by ID", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function markBookStatus(req, res) {
  try {
    const { userId, bookId } = req.params;
    const { status } = req.body;

    await usersService.markBookStatus(userId, bookId, status);

    res
      .status(200)
      .json({ success: true, message: "Libro marcado correctamente" });
  } catch (error) {
    console.error("Error marking book status:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
}

export async function getMarkedBooks(req, res) {
  const { userId } = req.params;

  try {
    const markedBooks = await usersService.getMarkedBooks(userId);
    res.status(200).json(markedBooks);
  } catch (error) {
    console.error("Error fetching marked books:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
}

export async function removeBook(req, res) {
  const { userId, bookId } = req.params;

  try {
    const result = await usersService.deleteBook(userId, bookId);
    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({ success: true, message: "Book removed successfully" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Book or user not found" });
    }
  } catch (error) {
    console.error("Error removing book:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getMarkedBookById(req, res) {
  try {
    const { userId, bookId } = req.params;
    const status = await usersService.getBookStatus(userId, bookId);

    if (status) {
      res.json({ status });
    } else {
      res.status(404).json({ message: "Estado del libro no encontrado" });
    }
  } catch (error) {
    console.error("Error getting book status:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function getAllFavorites(req, res) {
  try {
    const favorites = await usersService.getAllFavorites();
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getFavoriteById(req, res) {
  try {
    const { id } = req.params;
    const favorite = await usersService.getFavoriteById(id);

    if (!favorite) {
      return res.status(404).json({ message: " not found" });
    }

    res.status(200).json(favorite);
  } catch (error) {
    console.error("Error fetching by ID", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function addFavorite(req, res) {
  try {
    const { bookId } = req.params;
    const { userId } = req.body; // Extraer el userId del cuerpo de la solicitud
    const favorite = await usersService.addFavorite(userId, bookId);

    res.status(200).json(favorite);
  } catch (error) {
    console.error("Error marking book status:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
}

export async function getFavoriteByUser(req, res) {
  try {
    const { userId } = req.params;

    const favorites = await usersService.getFavoriteByUser(userId);
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
}

export async function removeFavorite(req, res) {
  try {
    const { id } = req.params;
    const favorite = await usersService.removeFavorite(id);

    if (!favorite) {
      return res.status(404).json({ message: " not found" });
    }

    res.status(200).json(favorite);
  } catch (error) {
    console.error("Error removing by ID", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function addHighlight(req, res) {
  try {
    const { userId, bookId, highlightText, location } = req.body;
    const highlightData = { highlightText, location };

    const highlight = await usersService.addHighlight(
      userId,
      bookId,
      highlightData
    );
    res.status(201).json(highlight);
  } catch (error) {
    console.error("Error adding highlight:", error);
    res.status(400).json({ error: error.message });
  }
}

export async function getHighlights(req, res) {
  try {
    const { userId, bookId } = req.params;

    const highlights = await usersService.getHighlights(userId, bookId);

    res.status(200).json(highlights);
  } catch (error) {
    console.error("Error fetching highlights:", error);
    res.status(400).json({ error: error.message });
  }
}

export async function getHighlightsByUser(req, res) {
  try {
    const { userId } = req.params;
    const highlights = await usersService.getHighlightsByUser(userId);

    res.status(200).json(highlights);
  } catch (error) {
    console.error("Error fetching highlights by user:", error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateProfile(req, res) {
  const { userId } = req.params;

  try {
    const existingUser = await usersService.getUserById(userId);

    const updateUser = {
      nombre: req.body.nombre || existingUser.nombre,
      biografia: req.body.biografia || existingUser.biografia,
      image: req.file ? `uploads/${req.file.filename}` : existingUser.image,
    };

    const updatedProfile = await usersService.updateProfile(userId, updateUser);

    if (req.file && existingUser.image) {
      const oldImagePath = path.resolve("uploads", existingUser.image);
      console.log("Attempting to delete old image at:", oldImagePath);

      fs.access(oldImagePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error("Old image file does not exist:", err);
        } else {
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error("Error deleting old image:", err);
            } else {
              console.log("Old image deleted successfully");
            }
          });
        }
      });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function removeImage(req, res) {
  try {
    const { userId } = req.params;
    const result = await usersService.removeUserImageService(userId);

    if (result.success) {
      return res
        .status(200)
        .json({ message: "Imagen eliminada correctamente" });
    } else {
      return res.status(result.statusCode).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
}

export default {
  createUser,
  login,
  getAllUsers,
  getUserById,
  markBookStatus,
  getMarkedBooks,
  getMarkedBookById,
  removeBook,
  getAllFavorites,
  getFavoriteById,
  addFavorite,
  getFavoriteByUser,
  removeFavorite,
  addHighlight,
  getHighlights,
  getHighlightsByUser,
  removeImage,
};
