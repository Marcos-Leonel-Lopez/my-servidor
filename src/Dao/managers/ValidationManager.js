import AccessManager from "./AccessManager.js";
import productModel from "../models/product.model.js";

const accessManager = new AccessManager();

export default class ValidationManager {

    getProducts = async (limit) => {
        if (limit) {
            if (limit > 0) {
                await accessManager.createRecords(`Consulta los productos los primeros ${limit} productos`);
                const payload = await productModel.find().limit(limit)
                return {
                    status: 200,
                    smg: {
                        status: "success",
                        payload
                    }
                }
            }
            await accessManager.createRecords("Get fallido - limit menor a 0");
            return {
                status: 400,
                smg: {
                    status: "error",
                    error: `Limite debe ser mayor a 0(cero)`
                }
            }
        } else {
            await accessManager.createRecords("Consulta los productos");
            const payload = await productModel.find();
            return {
                status: 200,
                smg: {
                    status: "success",
                    payload
                }
            }
        }
    };

    getProductById = async (id) => {
        const payload = await productModel.find({ _id: id });
        if (payload.length > 0) {
            await accessManager.createRecords(`Consulta el producto id: ${id}`);
            return {
                status: 200,
                smg: {
                    status: "success",
                    payload
                }
            }
        }
        await accessManager.createRecords(`Get fallido - id inexistente`);
        return {
            status: 400,
            smg: {
                status: "error",
                error: `El producto con id:${id} no existe`
            }
        }
    }

    deleteProduct = async (id) => {
        const payload = await productModel.deleteOne({ _id: id });
        if (payload.deletedCount == 1) {
            await accessManager.createRecords(`Elimina el producto id: ${id}`);
            return {
                status: 200,
                smg: {
                    status: "success",
                    payload,
                }
            }
        }
        await accessManager.createRecords(`Delete fallido - id inexistente`);
        return {
            status: 400,
            smg: {
                status: "error",
                error: `El producto con id:${id} no existe`
            }
        }
    }

    addProduct = async (newProduct) => {
        const { code } = newProduct;
        const data = await this.correctData(newProduct);
        if (data != "success") {
            await accessManager.createRecords(`Post fallido - falta: ${data.join(", ")}`);
            return {
                status: 400,
                smg: {
                    status: "error",
                    error: `falta: ${data.join(", ")}`,
                }
            }
        }
        const repeat = await this.codeRepeat(code);
        if (repeat) {
            await accessManager.createRecords(`Post fallido - codigo se repite`);
            return {
                status: 400,
                smg: repeat
            }
        }
        await accessManager.createRecords(`Post correcto - se agrego ${newProduct.title}`);
        const payload = await productModel.create(newProduct);
        return {
            status: 200,
            smg: {
                status: "success",
                payload,
            }
        }
    }

    updateProduct = async (id, newData) => {
        let editValues = await this.conditionData(newData); //acondiciona datos, elimina vacios y undefined
        if (editValues.code) {
            const repeat = await this.codeRepeat(editValues.code);
            if (repeat) {
                await accessManager.createRecords(`Put fallido codigo se repite`);
                return {
                    status: 400,
                    smg: repeat
                }
            }
        }// detecta si el codigo se repite
        const consulta = await productModel.find({ _id: id });
        if (consulta.length > 0) {
            await accessManager.createRecords(`Modifica el producto id: ${id}`);
            const payload = await productModel.updateOne({ _id: id }, { $set: editValues });
            return {
                status: 200,
                smg: {
                    status: "success",
                    payload
                }
            }
        }
        else {
            await accessManager.createRecords(`Put fallido id inexistente`);
            return {
                status: 400,
                smg: {
                    status: "error",
                    error: `El producto con id:${id} no existe`,
                }
            }
        }
    }










    codeRepeat = async (code) => {
        let result = await productModel.find({ code: code });
        if (result.length > 0) {
            return {
                status: "error",
                error: "El codigo se repite",
            };
        }
        return false;
    };

    correctData = async (product) => {
        let mData = [];
        let obj = Object.entries(product);
        obj.forEach((el) => {
            if (el[1] == "") {
                if (el[0] != 'thumbnail') {
                    mData.push(el[0]); // cambio para evitar que valide el campo thumbnail
                }
            }
        });
        if (mData.length > 0) {
            return mData
        }
        return 'success'
    }

    conditionData = async (newData) => {
        let editValues = {};
        for (let [key, value] of Object.entries(newData)) {
            value = value === "" ? undefined : value;
            if (value !== undefined) {
                editValues[key] = value;
            }
        };
        return editValues;
    }


}