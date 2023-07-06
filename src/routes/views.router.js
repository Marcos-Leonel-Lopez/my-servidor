import { Router } from "express";
import AccessManager from "../Dao/managers/AccessManager.js";
import ProductController from "../controllers/product.controller.js";
import CartController from "../controllers/cart.controller.js";
import userModel from "../Dao/models/user.model.js";
import { config } from "../config/config.js";

const accessManager = new AccessManager();
const productController = new ProductController();
const cartController = new CartController();


const router = Router();

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/products');
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
}
const adminAccess = async (req, res, next) => {
    try {
        if(req.user.role != 'admin') return res.redirect('/profile');
        next();
    } catch (error) {
        next(error);
    }
}
const onlyClient = async (req, res, next) => {
    try {
        if(req.user.role != 'client') return res.redirect('/profile');
        next();
    } catch (error) {
        next(error);
    }
}



router.get('/', productController.root)

router.get('/registerProduct',privateAccess, adminAccess, productController.registerProduct)

router.get('/products', productController.getProductsPage)

router.get('/realtimeproducts', productController.realtimeproducts)

router.get('/chat',privateAccess ,onlyClient , productController.chat)

router.get('/cart/:cid', cartController.getCartByIdRender)

router.get('/register', publicAccess, (req, res) => {
    res.render('register', { title: 'Registro de Usuario', style: 'style.css' })
})

router.get('/login', publicAccess, async (req, res) => {
    res.render('login', { title: 'Login', style: 'style.css' })
})

router.get('/profile', privateAccess, (req, res) => {
    res.render('profile', { user: req.session.user, title: 'Mi Perfil', style: 'style.css' })
})

router.get('/resetPassword', (req, res) => {
    res.render('resetPassword', { title: 'Reestablecer contraseña', style: 'style.css' })
})


export default router;