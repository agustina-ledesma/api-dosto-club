import express from 'express';
import cors from 'cors';
import route from './src/routes/route.js';
import { config } from 'dotenv';
import path from 'path';
config();

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* JWT */
export const JWT_EXPIRES = process.env.JWT_EXPIRES;
export const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
const PORT = 3000;

app.use(cors({origin: '*'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(route);


const uploadsPath = path.resolve(__dirname, 'src', 'uploads');
console.log(`Serving static files from: ${uploadsPath}`);
app.use('/uploads', express.static(uploadsPath));

app.get('/', (req, res) => {
  res.send('Hola je');
});

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en http://localhost:${PORT}`);
});




