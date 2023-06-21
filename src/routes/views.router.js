import { Router } from "express";
import AccessManager from "../Dao/managers/AccessManager.js";
import ProductController from "../controllers/product.controller.js";
import CartManager from "../Dao/managers/CartManager.js";
import userModel from "../Dao/models/user.model.js";

const accessManager = new AccessManager();
const productController = new ProductController();
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

router.get('/', productController.root)

router.get('/registerProduct', productController.registerProduct)

router.get('/products', productController.getProductsPage)

router.get('/realtimeproducts', productController.realtimeproducts)

router.get('/chat', productController.chat)

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

router.get('/resetPassword', (req,res)=>{
    res.render('resetPassword', {title:'Reestablecer contraseña', style: 'style.css'})
})


export default router;