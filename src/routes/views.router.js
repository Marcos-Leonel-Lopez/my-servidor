import { Router } from "express";
import AccessManager from "../Dao/managers/AccessManager.js";
import ProductController from "../controllers/product.controller.js";
import CartController from "../controllers/cart.controller.js";
import UserController from "../controllers/user.controller.js";
import userModel from "../Dao/models/user.model.js";
import { config } from "../config/config.js";
import { onlyClient, publicAccess, exclusiveAccess, privateAccess , onlyAdmin} from "../middlewares/auth.js";

const accessManager = new AccessManager();
const productController = new ProductController();
const cartController = new CartController();
const userController = new UserController();

const router = Router();

router.get('/', productController.root)

router.get('/script', productController.script)

router.get('/registerProduct', privateAccess, exclusiveAccess, productController.registerProduct)

router.get('/products', productController.getProductsPage)

router.get('/realtimeproducts', productController.realtimeproducts)

router.get('/chat', privateAccess, onlyClient, productController.chat)

router.get('/panelAdmin', onlyAdmin,  userController.panelAdmin)

router.get('/cart/:cid', onlyClient, cartController.getCartByIdRender)

router.get('/register', publicAccess, (req, res) => {
    res.render('register', { title: 'Registro de Usuario', style: 'style.css' })
})

router.get('/login', publicAccess, async (req, res) => {
    res.render('login', { title: 'Login', style: 'style.css' })
})

router.get('/profile', privateAccess, (req, res) => {
    res.render('profile', { user: req.session.user, title: 'Mi Perfil', style: 'style.css' })
})

router.get('/forgot-password', (req, res) => {
    res.render('forgotPassword', { title: 'Reestablecer contraseña', style: 'style.css' })
})
router.get('/resetPassword', (req, res) => {
    const token = req.query.token;
    res.render('resetPassword', { token: token, title: 'Reestablecer contraseña', style: 'style.css' })
})
router.get('/failregister', (req, res) => {
    return res.status(400).send({
        status: 'error',
        message: 'error al intentar registrarse'
    })
})


router.get('/loggerTest', (req, res) => {
    req.logger.fatal("fatal!");
    req.logger.error("error!");
    req.logger.warning("warning!");
    req.logger.info('info');
    req.logger.http('http');
    req.logger.verbose('verbose');
    req.logger.debug('debug');
    req.logger.silly('silly');
    res.redirect('/products')
})


export default router;