import { Router } from "express";
import ProductController from "../controllers/product.controller.js";

const productController = new ProductController();

const router = Router();

router.get('/', productController.getProducts)

router.get("/:pid", productController.getProductById);

router.delete("/:pid", productController.deleteProduct);

router.post("/", productController.addProduct);

router.put("/:pid", productController.updateProduct);

export default router;
