import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js'
import __dirname from './utils.js';


const PORT = process.env.PORT || 8080;
const app = express();
//database
const MONGO = 'mongodb+srv://marcoslopez:tcWJGd05WNJu4ztm0SLYw2eiZGpA5@marcosapp.4nigp8k.mongodb.net/ecommerce?retryWrites=true&w=majority'
const connection = mongoose.connect(MONGO);
//servicio
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//vistas
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

const server = app.listen(PORT, () => {
    console.log(`Servidor funcionando en ${PORT}`);
});
//servidor
const io = new Server(server); 







//rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);