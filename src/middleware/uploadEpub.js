import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Verifica el directorio del archivo actual
const __dirname = path.resolve();

// Ruta a la carpeta uploads/epubs dentro de src
const uploadDir = path.join(__dirname, 'src', 'uploads', 'epubs');

// Crea la carpeta uploads/epubs dentro de src si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración del almacenamiento de Multer para EPUB
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});



// Crear una instancia de Multer con la configuración
const uploadEpub = multer({
  storage: storage,

  limits: {
    fileSize: 1024 * 1024 * 10, // Límite de tamaño de archivo a 10MB
  },
});

export default uploadEpub;
