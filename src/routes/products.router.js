import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import compression from "express-compression";

const productController = new ProductController();

const router = Router();

router.get('/', productController.getProducts)

router.get("/mockingproducts", compression(), productController.mockingproducts);

router.get("/:pid", productController.getProductById);

router.delete("/:pid", productController.deleteProduct);

router.post("/", productController.addProduct);

router.put("/:pid", productController.updateProduct);



export default router;
