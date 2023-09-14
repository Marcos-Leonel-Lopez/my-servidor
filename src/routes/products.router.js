import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import compression from "express-compression";
import { checkAuthenticated, privateAccess, exclusiveAccess } from "../middlewares/auth.js";
import { uploaderProduct } from "../middlewares/handleFiles.js";

const productController = new ProductController();

const router = Router();

router.get('/', productController.getProducts)
router.get("/mockingproducts", compression(), productController.mockingproducts);
router.get("/:pid", productController.getProductById);
router.delete("/:pid", productController.deleteProduct);
router.post("/",exclusiveAccess, productController.addProduct);
router.put('/:code/documents', checkAuthenticated, exclusiveAccess , uploaderProduct.fields([{name:'img_1',maxCount:1},{name:'img_2',maxCount:1},{name:'img_3',maxCount:1},{name:'img_4',maxCount:1},{name:'img_5',maxCount:1}]),productController.updateProductDocuments)
router.put("/:pid", productController.updateProduct);

export default router;
