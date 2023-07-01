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
        // if (config.port == 8080) {
        //     const user = await userModel.findOne({ mail: config.admin_email });
        //     if (user) {
        //         req.session.user = {
        //             name: `${user.first_name} ${user.last_name}`,
        //             mail: `${user.mail}`,
        //             age: `${user.age}`,
        //             role: `${user.role}`,
        //             cart: `${user.cart}`,
        //         };
        //         return res.redirect('/products')
        //     }
        // }else{
        //     console.log(req.session.user?.role);
        //     console.log(req.session);
            
        //     if(req.user == 'admin'){
        //         req.session.destroy(err => {
        //             if (err) return res.status(500).send({
        //                 status: 'error',
        //                 message: 'No se pudo cerrar sesion'
        //             })
        //             res.redirect('/login')
        //         });
        //     }
        // }
        next();
    } catch (error) {
        next(error);
    }
}

router.get('/', productController.root)

router.get('/registerProduct', productController.registerProduct)

router.get('/products', productController.getProductsPage)

router.get('/realtimeproducts', productController.realtimeproducts)

router.get('/chat', productController.chat)

router.get('/cart/:cid', cartController.getCartByIdRender)

router.get('/register', publicAccess, (req, res) => {
    res.render('register', { title: 'Registro de Usuario', style: 'style.css' })
})

router.get('/login', adminAccess, publicAccess, async (req, res) => {
    res.render('login', { title: 'Login', style: 'style.css' })
})

router.get('/profile', privateAccess, (req, res) => {
    res.render('profile', { user: req.session.user, title: 'Mi Perfil', style: 'style.css' })
})

router.get('/resetPassword', (req, res) => {
    res.render('resetPassword', { title: 'Reestablecer contraseña', style: 'style.css' })
})


export default router;