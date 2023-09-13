import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import { checkAuthenticated } from "../middlewares/auth.js";

const cartController = new CartController();

const router = Router();

router.get('/', cartController.getCarts)//1
router.get('/:cid', cartController.getCartById)//3
router.post('/', cartController.addCart)//2
router.post('/:cid/product/:pid', checkAuthenticated, cartController.addProductToCart);//5 
router.put('/:cid/product/:pid', checkAuthenticated,  cartController.updateProductQuantity)//6
router.delete('/:cid/product/:pid', cartController.deleteProductOnCart);//6
router.delete('/:cid', cartController.deleteAllProductsFromCart)//4
router.get('/:cid/purchase', checkAuthenticated, cartController.createOrder)

export default router