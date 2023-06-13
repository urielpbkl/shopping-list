import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import categorieRoutes from './routes/categegories.routes.js';
import mallRoutes from './routes/malls.rutes.js';
import measurementUnitRoutes from './routes/measurementunit.routes.js'
import productsRoutes from './routes/products.rutes.js'
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('../', import.meta.url));

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la ruta estática para servir los archivos de imágenes
app.use('/static', express.static(path.join(__dirname, 'src/Images')));

app.use(categorieRoutes, mallRoutes, measurementUnitRoutes, productsRoutes);

const port = process.env.PORT ?? 8080;

app.listen(port, () => {
    console.log(`La aplicación está corriendo en el puerto ${port}`);
});
