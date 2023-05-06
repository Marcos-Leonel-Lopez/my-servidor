import { Router } from "express";
import AccessManager from "../Dao/managers/AccessManager.js";
import productModel from "../Dao/models/product.model.js";
import ValidationManager from "../Dao/managers/ValidationManager.js";

const accessManager = new AccessManager();
const validationManager = new ValidationManager();

const router = Router();

router.get("/", async (req, res) => {
    const { limit } = req.query;
    await accessManager.createRecords("Consulta los productos");
    if (limit) {
        if (limit > 0) {
            const productslimit = await productModel.find().limit(limit)
            return res.status(200).send({
                status: "success",
                productslimit
            });
        } 
            return res.status(400).send({
                status: "error",
                error: `Limite debe ser mayor a 0(cero)`,
            });
    } else {
        const result = await productModel.find();
        return res.status(200).send({
            status: "success",
            result
        });
    }
});

router.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    await accessManager.createRecords(`Consulta el producto id: ${id}`);
    const result = await productModel.find({ _id: id });
    if (result.length > 0) {
        return res.status(200).send({ status: "success", result });
    }
    await accessManager.createRecords(`Consulta id inexistente`);
    res.status(400).send({
        status: "error",
        error: `El producto con id:${id} no existe`,
    });
    return;
});

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;
    await accessManager.createRecords(`Elimina el producto id: ${id}`);
    const result = await productModel.deleteOne({ _id: id });
    if (result.deletedCount == 1) {
        return res.status(200).send({
            status: "success",
            result,
        });
    }
    await accessManager.createRecords(`Consulta id inexistente`);
    res.status(400).send({
        status: "error",
        error: `El producto con id:${id} no existe`,
        result,
    });
    return;
});

router.post("/", async (req, res) => {
    const newProduct = req.body;
    const { code } = newProduct;
    const data = await validationManager.correctData(newProduct);
    if (data != "success") {
        await accessManager.createRecords(
            `Post failure - falta: ${data.join(", ")}`
        );
        return res.status(400).send({
            status: "error",
            error: `falta: ${data.join(", ")}`,
        });
    }
    const repeat = await validationManager.codeRepeat(code);
    if (repeat) {
        await accessManager.createRecords(`Post failure - codigo se repite`);
        return res.status(400).send({
            status: "error",
            error: "El codigo se repite",
        });
    }
    await accessManager.createRecords(
        `POST de api - se agrego ${newProduct.title}`
    );
    const result = await productModel.create(newProduct);
    return res.status(200).send({
        status: "success",
        result,
    });
});

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const newData = req.body;
    await accessManager.createRecords(`Modifica el producto id: ${id}`);
    const result = await productModel.updateOne({ _id: id }, { $set: newData });
    res.send({ result });
});

export default router;
