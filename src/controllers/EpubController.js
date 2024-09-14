import * as epubService from "../services/epubService.js";
import fs from "fs";
import path from "path";

export async function getAllEpubs(req, res) {
  try {
    const epubs = await epubService.getAllEpubs();
    res.status(200).json(epubs);
  } catch (error) {
    console.error("Error fetching books", error);
    res.status(500).send("Internal Server Error");
  }
}
export async function getEpubById(req, res) {
  try {
    const { id } = req.params;
    const epub = await epubService.getEpubById(id);

    if (!epub) {
      return res.status(404).json({ message: "Epub not found" });
    }

    res.status(200).json(epub);
  } catch (error) {
    console.error("Error fetching epub by ID", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function uploadEpub(req, res) {
  const { bookId } = req.params;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se subió ningún archivo EPUB" });
    }

    // Obtener el nombre del archivo y la ruta relativa
    const filePath = `uploads/epubs/${req.file.filename}`;

    const epubData = {
      filePath: filePath,
      fileName: req.file.filename,
    };

    const result = await epubService.uploadEpub(bookId, epubData);

    res.status(201).json({ message: "EPUB subido con éxito", epub: result });
  } catch (error) {
    console.error("Error al subir el EPUB:", error);
    res.status(500).json({ message: "Hubo un error al subir el EPUB" });
  }
}


export async function getEpubByBookId(req, res) {
  const { bookId } = req.params;

  try {
    const epub = await epubService.getEpubByBookId(bookId);
    if (epub) {
      res.json(epub);
    } else {
      res
        .status(404)
        .json({ message: "No se encontró el EPUB para el libro especificado" });
    }
  } catch (error) {
    console.error("Error al obtener el EPUB:", error);
    res.status(500).json({ message: "Hubo un error al obtener el EPUB" });
  }
}

 export async function deleteEpub(req, res) {
  try {
    const id = req.params.id;
    const deletedEpub = await epubService.deleteEpub(id);

    if (deletedEpub) {
      res.status(200).json({ message: "Epub deleted successfully." });
    } else {
      res.status(404).json({ message: "Epub not found." });
    }
  } catch (error) {
    console.error("Error deleting Epub", error);
    res.status(500).send("Internal Server Error");
  }
}



export default {
  getAllEpubs,
  uploadEpub,
  getEpubById,
  getEpubByBookId,
  deleteEpub,
};
