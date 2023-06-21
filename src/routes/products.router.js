import { Router } from "express";
import ProductController from "../controllers/product.controller.js";


const productController = new ProductController();

const router = Router();

router.get('/', productController.getProducts)

// router.get("/", async (req, res) => {
//     const { limit } = req.query;
//     const result = await productController.getProducts(limit);
//     const {status, smg} = result;
//     return res.status(status).send(smg);
// });

router.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    const result = await productController.getProductById(id);
    const {status, smg} = result;
    return res.status(status).send(smg);
});

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;
    const result = await productController.deleteProduct(id);
    const {status, smg} = result;
    return res.status(status).send(smg);
});

router.post("/", async (req, res) => {
    const newProduct = req.body;
    const result = await productController.addProduct(newProduct);
    const {status, smg} = result;
    return res.status(status).send(smg);
});

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const newData = req.body;
    const result = await productController.updateProduct(id, newData);
    const {status, smg} = result;
    return res.status(status).send(smg);
});

export default router;
