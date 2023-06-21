import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import cartModel from "../Dao/models/cart.model.js";
import ProductController from "../controllers/product.controller.js";

const cartController = new CartController();
const productController = new ProductController();

const router = Router();

router.get('/', cartController.getCarts)

router.get('/:cid', cartController.getCartById)

router.post('/', cartController.addCart)

router.post('/:cid/product/:pid', cartController.addProductToCart);
  
router.put('/:cid/product/:pid', cartController.updateProductQuantity)

router.delete('/:cid/product/:pid', cartController.deleteProductOnCart);

router.delete('/:cid', cartController.deleteAllProductsFromCart)

export default router