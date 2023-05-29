import { Router } from "express";
import AccessManager from "../Dao/managers/AccessManager.js";
import ValidationManager from "../Dao/managers/ValidationManager.js";
import CartManager from "../Dao/managers/CartManager.js";

const accessManager = new AccessManager();
const validationManager = new ValidationManager();
const cartManager = new CartManager();


const router = Router();

const publicAccess = (req, res, next)=>{
    if(req.session.user) return res.redirect('/products');
        next();
        
}

const privateAccess = (req, res, next)=>{
    if(!req.session.user)return res.redirect('/login');
        next();
    
}


router.get('/',(req,res)=>{
    return res.redirect('/login');
})


router.get('/registerProduct', (req, res) => {
    res.render('registerProduct' , { title:'Registro de productos',style: 'style.css'});
})

router.get('/products', async (req,res)=>{
    const { limit = 10, page = 1, category = 'all', stock = 'all', sort = 'none'} = req.query;
    const result = await validationManager.getProductsPage(limit, page, category, stock, sort);
    const userName = req.session.user?.name;
    let userRole = false;
    // verificando por role
    if(req.session.user?.role == 'admin'){
        userRole = true;
    }

    // verificando por mail
    // if(req.session.user?.mail == 'adminCoder@coder.com'){
    //     userRole = true;
    // }
    

    const {status, smg} = result;
    if(status == 200){
        const {payload, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink} = smg;
        await accessManager.createRecords("Consulta los productos");
        const products = payload.map(item=>item.toObject())     
        return res.render('home', { products, hasPrevPage, hasNextPage, nextPage, prevPage,prevLink, nextLink, totalPages, limit, page, category , stock, sort, userName, userRole, title:'Productos', style: 'style.css', error: false })
    }
    await accessManager.createRecords("Get fallido - limit menor a 0");
    return res.render('home', { title:'Productos', style: 'style.css', error: true })
})

router.get('/realtimeproducts', async (req,res)=>{
    return res.render('realTimeProducts', { title:'Productos en tiempo real', style: 'style.css', error: false })
})

router.get('/chat', (req, res)=>{
    return res.render('chat',{ title:'Chat', style: 'style.css', error: false })
})

router.get('/carts/:cid', async (req, res)=>{
        const cid = req.params.cid;
        const result = await cartManager.getCartById(cid);
        const { status, smg } = result;
        const theCart = smg.cart.products.map(item=>item.toObject())
        theCart.map(el => console.log(el.productId.title, el.quantity));
        return res.render('cart',{cid, theCart, title:'Carrito', style: 'style.css' })
})

router.get('/register', publicAccess, (req,res)=>{
    res.render('register',{title:'Registro de Usuario', style: 'style.css'})
})

router.get('/login', publicAccess, (req,res)=>{
    res.render('login',{title:'Login', style: 'style.css'})
})

router.get('/profile', privateAccess, (req,res)=>{
    res.render('profile',{user: req.session.user , title:'Mi Perfil', style: 'style.css'})
})


export default router;