import multer from 'multer'
import path from 'path'
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('../', import.meta.url));
const uploadsFolder = path.join(__dirname, 'Images');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsFolder); // carpeta donde se guardarán las imágenes subidas
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname); // generar un nombre de archivo único
    }
});


export const upload = multer({ storage: storage }).single('logo')

