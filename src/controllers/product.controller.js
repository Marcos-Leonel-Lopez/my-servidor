import AccessManager from "../Dao/managers/AccessManager.js";
import { productService } from "../repository/index.repository.js";
import { UserDto } from "../Dao/dto/user.dto.js";


const accessManager = new AccessManager();




export default class ProductController {
    root = (req, res) => {
        return res.redirect('/login');
    }
    registerProduct = (req, res) => {
        res.render('registerProduct', { title: 'Registro de productos', style: 'style.css' });
    }
    getProductsPage = async (req, res) => {
        const { limit = 10, page = 1, category = 'all', stock = 'all', sort = 'none' } = req.query;
        const result = await productService.getProductsPage(limit, page, category, stock, sort);
        let admin = false; 
        let userRole = null;
        let userCart = null;
        let userName = null;
        const persona = req.session.user;   
        if(persona){
             const usuarioDto = new UserDto(persona);
             userName = usuarioDto.name;
             userRole = usuarioDto.role;
             userCart = usuarioDto.cart;
        }
        console.log(userRole + ' despues ');
        if (userRole === 'admin') {
            admin = true;
        }
        const { status, message } = result;
        if (status == 200) {
            const { payload, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink } = message;
            await accessManager.createRecords("Consulta los productos");
            const products = payload.map(item => item.toObject())
            return res.render('home', { products, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink, totalPages, limit, page, category, stock, sort, userName, admin, userCart, title: 'Productos', style: 'style.css', error: false })
        } else {
            await accessManager.createRecords("Get fallido - limit menor a 0");
            return res.render('home', { title: 'Productos', style: 'style.css', error: true })
        }
    }
    getProducts = async (req, res) => {
        const { limit } = req.query;
        const products = await productService.getProducts(limit);
        const { status, message } = products;
        return res.status(status).send(message);
    }
    getProductsRealTime = async (req, res) => {
        const products = await productService.getProducts();
        return products.message.payload
    }
    realtimeproducts = async (req, res) => {
        return res.render('realTimeProducts', { title: 'Productos en tiempo real', style: 'style.css', error: false })
    }
    chat = (req, res) => {
        return res.render('chat', { title: 'Chat', style: 'style.css', error: false })
    }
    getProductById = async (req, res) => {
        const id = req.params.pid;
        console.log(id);
        
        const result = await productService.getProductById(id);
        const { status, message } = result;
        return res.status(status).send(message);
    }
    deleteProduct = async (req, res) => {
        const id = req.params.pid;
        const result = await productService.deleteProduct(id);
        const { status, message } = result;
        return res.status(status).send(message);
    }
    addProduct = async (req, res) => {
        const newProduct = req.body;
        const result = await productService.addProduct(newProduct);
        const { status, message } = result;
        return res.status(status).send(message);
    }
    updateProduct = async (req, res) => {
        const id = req.params.pid;
        const newData = req.body;
        const result = await productService.updateProduct(id, newData);
        const { status, message } = result;
        return res.status(status).send(message);
    }
    mockingproducts = async (req, res) =>{
        try {
            const cantidad = 3;        
            const {status, message} = await productService.mockingproducts(cantidad)
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);            
        }
    }



}

