import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';

import { config } from './config/config.js';
import __dirname from './utils.js';
import productModel from './Dao/models/product.model.js';
import messagesModel from './Dao/models/message.model.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import sessionsRouter from './routes/sessions.router.js';
import viewsRouter from './routes/views.router.js';
import cookieRouter from './routes/cookie.router.js';
import ProductController from './controllers/product.controller.js';
import MessageManager from './Dao/managers/MessaggeManager.js';
import cartManager from './Dao/managers/CartManager.js';
import iniitializePassport from './config/passport.config.js';




const PORT = config.port || 8080;

const app = express();

//database
const MONGO = config.url;
const connection = mongoose.connect(MONGO);
console.log(config);


//servicio
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session({
    store: new MongoStore({
        mongoUrl:MONGO,
        ttl:360
    }),
    secret:'SecretCode',
    resave:true, // true or false?
    saveUninitialized:true // true or false? 
}));
iniitializePassport();
app.use(passport.initialize());
app.use(passport.session())
//vistas
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

const server = app.listen(PORT, () => {
    console.log(`Servidor funcionando en ${PORT}`);
});
//servidor
const productController = new ProductController();
const messageManager = new MessageManager();
const io = new Server(server);


// productos en tiempo real
io.on('connection', async client => {
    const result = await productController.getProductsRealTime();
    const products = result.map(item => item.toObject())
    io.emit('productList', products);

    client.on('newProduct', async (data, callback) => {
        console.log('Datos recibidos en el back:', data);
        await productController.addProduct(data); //debe ir el model
        const result = await productController.getProductsRealTime();
        const products = result.map(item => item.toObject()) 
        io.emit('productList', products);
        callback();
    })
    client.on('delete', async data => {
        console.log('Se eliminara id: ' + data);
        await productController.deleteProduct(data);
        const result = await productController.getProductsRealTime();
        const products = result.map(item => item.toObject()) 
        io.emit('productList', products);
    })
    //chat
    client.on('message', async data => {
        await messageManager.newMessage(data);
        const messagesBefore = await messageManager.getMessages()
        const messages = messagesBefore.map(item => item.toObject())
        io.emit('messageLogs', messages)
    })
    client.on('authenticated', data => {
        client.broadcast.emit('newUserConnected', data);
    })
    client.on('takeProduct', async data_id =>{
        const result = await productController.getProductById(data_id);
        const product = result.smg.payload.map(item => item.toObject());
        client.emit('productDetails',product);
    })
    client.on('editProduct', async (data,id) =>{
        await productController.updateProduct(id, data);
        const result = await productController.getProductsRealTime();
        const products = result.map(item => item.toObject())
        io.emit('productList', products);
    })
})

//rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts',cartsRouter);
app.use('/api/sessions',sessionsRouter);


//crea la cookie
// app.get('/',(req,res)=>{
//     res.render('cookies')
// })
// app.post('/cookie',(req,res)=>{
//     const data = req.body;
//     res.cookie('CoderCookie', data, {maxAge:10000}).send({status:'success',msg:'cookie set'})
// })


//abre una session
// let contador = 1;
// app.get('/',(req,res)=>{
//     const nombre = req.query.name;
//     if(!req.session.user){
//         req.session.user = {nombre};
//         return res.send(`Bienvenido ${req.session.user.nombre}`)
//     }
//     else{
//         return res.send(`Hola ${req.session.user.nombre}. Visitaste la ruta ${++contador} veces`)
//     }
// })

//persistencia de session en Mongo
// app.get('/',(req,res)=>{
//     req.session.user = 'Active Session';
//     res.send('Session Set');
// })

// app.get('/test',(req,res)=>{
//     res.send(req.session.user)
// })