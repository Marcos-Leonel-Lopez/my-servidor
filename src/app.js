import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import productModel from './Dao/models/product.model.js';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js'
import __dirname from './utils.js';
import ValidationManager from './Dao/managers/ValidationManager.js';


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
const validationManager = new ValidationManager();
const io = new Server(server); 

const messages = [];

 io.on('connection', async client => {
 
    const result = await validationManager.getProducts();
    const products = result.smg.payload.map(item=>item.toObject())
    io.emit('productList', products);
  

    client.on('newProduct', async (data, callback) => {
        console.log('Datos recibidos en el back:', data);
        await validationManager.addProduct(data); //debe ir el model
        const result = await validationManager.getProducts();
        const products = result.smg.payload.map(item=>item.toObject())
        io.emit('productList', products);
        callback();
    })
    
    client.on('delete', async data =>{
        console.log('Se eliminara id: '+data);
        await validationManager.deleteProduct(data);
        const result = await validationManager.getProducts();
        const products = result.smg.payload.map(item=>item.toObject())
        io.emit('productList', products);
    })

    // //chat

     client.on('message', async data =>{
         messages.push(data);
         console.log(data, messages);
         io.emit('messageLogs', messages)
     })

     client.on('authenticated', data =>{
         client.broadcast.emit('newUserConnected', data);
     })

 })







//rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);