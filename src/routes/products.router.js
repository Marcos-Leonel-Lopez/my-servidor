import { Router } from "express";
import AccessManager from "../Dao/managers/AccessManager.js";
import productModel from "../Dao/models/product.model.js";
import ValidationManager from "../Dao/managers/ValidationManager.js";

const accessManager = new AccessManager();
const validationManager = new ValidationManager();

const router = Router();

router.get("/", async (req, res) => {
    const { limit } = req.query;
    if (limit) {
        if (limit > 0) {
            await accessManager.createRecords(`Consulta los productos los primeros ${limit} productos`);
            const productslimit = await productModel.find().limit(limit)
            return res.status(200).send({
                status: "success",
                productslimit
            });
        }
        await accessManager.createRecords("Get fallido - limit menor a 0");
        return res.status(400).send({
            status: "error",
            error: `Limite debe ser mayor a 0(cero)`,
        });
    } else {
        await accessManager.createRecords("Consulta los productos");
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
    await accessManager.createRecords(`Get fallido - id inexistente`);
    res.status(400).send({
        status: "error",
        error: `El producto con id:${id} no existe`,
    });
    return;
});

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    const result = await productModel.deleteOne({ _id: id });
    if (result.deletedCount == 1) {
        await accessManager.createRecords(`Elimina el producto id: ${id}`);
        return res.status(200).send({
            status: "success",
            result,
        });
    }
    await accessManager.createRecords(`Delete fallido - id inexistente`);
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
        await accessManager.createRecords(`Post fallido - falta: ${data.join(", ")}`);
        return res.status(400).send({
            status: "error",
            error: `falta: ${data.join(", ")}`,
        });
    }
    const repeat = await validationManager.codeRepeat(code);
    if (repeat) {
        await accessManager.createRecords(`Post fallido - codigo se repite`);
        return res.status(400).send(repeat);
    }
    await accessManager.createRecords(`Post correcto - se agrego ${newProduct.title}`);
    const result = await productModel.create(newProduct);
    return res.status(200).send({
        status: "success",
        result,
    });
});

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const newData = req.body;
    let editValues = await validationManager.conditionData(newData); //acondiciona datos, elimina vacios y undefined
    if (editValues.code) {
        const repeat = await validationManager.codeRepeat(editValues.code);
        if (repeat) {
            await accessManager.createRecords(`Put fallido codigo se repite`);
            return res.status(400).send(repeat);
        }
    }// detecta si el codigo se repite
    const consulta = await productModel.find({ _id: id });
    if (consulta.length > 0) {
        await accessManager.createRecords(`Modifica el producto id: ${id}`);
        const result = await productModel.updateOne({ _id: id }, { $set: editValues });
        return res.status(200).send({
            status: "success",
            result
        });
    }
    else {
        await accessManager.createRecords(`Put fallido id inexistente`);
        return res.status(400).send({
            status: "error",
            error: `El producto con id:${id} no existe`,
        });
    }
});

export default router;
