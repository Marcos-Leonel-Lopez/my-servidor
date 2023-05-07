import { Router } from "express";
import ValidationManager from "../Dao/managers/ValidationManager.js";


const validationManager = new ValidationManager();

const router = Router();

router.get("/", async (req, res) => {
    const { limit } = req.query;
    const result = await validationManager.getProducts(limit);
    const {status, smg} = result;
    return res.status(status).send(smg);
});

router.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    const result = await validationManager.getProductById(id);
    const {status, smg} = result;
    return res.status(status).send(smg);
});

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;
    const result = await validationManager.deleteProduct(id);
    const {status, smg} = result;
    return res.status(status).send(smg);
});

router.post("/", async (req, res) => {
    const newProduct = req.body;
    const result = await validationManager.addProduct(newProduct);
    const {status, smg} = result;
    return res.status(status).send(smg);
});

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const newData = req.body;
    const result = await validationManager.updateProduct(id, newData);
    const {status, smg} = result;
    return res.status(status).send(smg);
});

export default router;
