import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const cartController = new CartController();

const router = Router();

router.get('/', cartController.getCarts)

router.get('/resolve', cartController.resolveCart)

router.get('/:cid', cartController.getCartById)

router.post('/', cartController.addCart)

router.post('/:cid/product/:pid', cartController.addProductToCart);
  
router.put('/:cid/product/:pid', cartController.updateProductQuantity)

router.delete('/:cid/product/:pid', cartController.deleteProductOnCart);

router.delete('/:cid', cartController.deleteAllProductsFromCart)



export default router