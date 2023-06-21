import AccessManager from "../Dao/managers/AccessManager.js";
import ProductService from "../services/product.service.js";

const accessManager = new AccessManager();
const productService = new ProductService();

export default class ProductController {
    root = (req,res)=>{
        return res.redirect('/login');
    }
    registerProduct = (req, res) => {
        res.render('registerProduct' , { title:'Registro de productos',style: 'style.css'});
    }
    getProductsPage = async (req, res) => {
        const { limit = 10, page = 1, category = 'all', stock = 'all', sort = 'none' } = req.query;
        let userRole = false;
        const result = await productService.getProductsPage(limit, page, category, stock, sort);
        const userName = req.session.user?.name ? req.session.user.name : req.session.user?.first_name;
        if (req.session.user?.role == 'admin') {
            userRole = true;
        }
        const { status, smg } = result;
        if (status == 200) {
            const { payload, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink } = smg;
            await accessManager.createRecords("Consulta los productos");
            const products = payload.map(item => item.toObject())
            return res.render('home', { products, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink, totalPages, limit, page, category, stock, sort, userName, userRole, title: 'Productos', style: 'style.css', error: false })
        } else {
            await accessManager.createRecords("Get fallido - limit menor a 0");
            return res.render('home', { title: 'Productos', style: 'style.css', error: true })
        }
    }
    getProducts = async (req, res) => {
        const { limit } = req.query;
        const products = await productService.getProducts(limit);
        const { status, smg } = products;
        return res.status(status).send(smg);
    }
    getProductsRealTime = async (req, res) => {
        const products = await productService.getProducts();
        return products.smg.payload
    }
    realtimeproducts = async (req,res) => {
        return res.render('realTimeProducts', { title:'Productos en tiempo real', style: 'style.css', error: false })
    }
    chat = (req, res)=>{
        return res.render('chat',{ title:'Chat', style: 'style.css', error: false })
    }
    getProductById = async (req, res) =>{
        const id = req.params.pid;
        const result = await productService.getProductById(id);
        const {status, smg} = result;
        return res.status(status).send(smg);
    }
    deleteProduct = async (req, res) => {
        const id = req.params.pid;
        const result = await productService.deleteProduct(id);
        const {status, smg} = result;
        return res.status(status).send(smg);
    }
    addProduct = async (req, res) => {
        const newProduct = req.body;
        const result = await productService.addProduct(newProduct);
        const {status, smg} = result;
        return res.status(status).send(smg);
    }
    updateProduct = async (req, res) => {
        const id = req.params.pid;
        const newData = req.body;
        const result = await productService.updateProduct(id, newData);
        const {status, smg} = result;
        return res.status(status).send(smg);
    }
}