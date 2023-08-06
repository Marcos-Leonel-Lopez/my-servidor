import { Router } from "express";
import CartController from "../controllers/cart.controller.js";


const cartController = new CartController();

const router = Router();

router.get('/', cartController.getCarts)//1

router.get('/resolve', cartController.resolveCart)

router.get('/:cid', cartController.getCartById)//3

router.post('/', cartController.addCart)//2

router.post('/:cid/product/:pid', cartController.addProductToCart);//5
  
router.put('/:cid/product/:pid', cartController.updateProductQuantity)//6

router.delete('/:cid/product/:pid', cartController.deleteProductOnCart);//6

router.delete('/:cid', cartController.deleteAllProductsFromCart)//4

router.get('/:cid/purchase', cartController.createOrder)


export default router