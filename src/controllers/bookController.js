import * as bookService from "../services/bookService.js";
import multer from "multer"; // Paquete para manejar la subida de archivos
import path from "path";
import fs from "fs";

export async function getAllBooks(req, res) {
  try {
    const books = await bookService.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const book = await bookService.getBookById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book by ID", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function createBook(req, res) {
  try {
    const newBook = {
      titulo: req.body.titulo,
      autor: req.body.autor,
      /*  fechaPublicacion: req.body.fechaPublicacion, */
      originalName: req.body.originalName,
      genero: req.body.genero,
      descripcion: req.body.descripcion,
      imagePath: req.file ? path.join("uploads", req.file.filename) : null,
    };

    const createdBook = await bookService.createBook(newBook);

    res.status(201).json(createdBook);
  } catch (error) {
    console.error("Error creating book", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function editBook(req, res) {
  try {
    const bookId = req.params.id;
    const updatedBook = req.body;

    if (req.file) {
      updatedBook.imagePath = `uploads/${req.file.filename}`;
    }

    // Obtener el libro existente para verificar la imagen anterior
    const existingBook = await bookService.getBookById(bookId); //
    const result = await bookService.editBook(bookId, updatedBook);

    if (result.modifiedCount > 0) {
      // Eliminar la imagen antigua si existe y si se ha subido una nueva
      if (req.file && existingBook.imagePath) {
        const oldImagePath = path.resolve("src", existingBook.imagePath);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          } else {
            console.log("Old image deleted successfully");
          }
        });
      }
      res.status(200).json({ message: "Book updated successfully" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error editing book", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function deleteBook(req, res) {
  try {
    const bookId = req.params.id;
    const deletedBook = await bookService.deleteBook(bookId);

    if (deletedBook) {
      res.status(200).json({ message: "Book deleted successfully." });
    } else {
      res.status(404).json({ message: "Book not found." });
    }
  } catch (error) {
    console.error("Error deleting book", error);
    res.status(500).send("Internal Server Error");
  }
}

export default {
  getAllBooks,
  getBookById,
  createBook,
  editBook,
  deleteBook,
};
