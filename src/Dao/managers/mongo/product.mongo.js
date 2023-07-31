import productModel from "../../models/product.model.js";
import AccessManager from "../AccessManager.js";
import { generateProduct } from "../../../utils.js";
import userModel from "../../models/user.model.js";


const accessManager = new AccessManager();

export class ProductMongo {
    getProductsPage = async (limit, page, category, stock, sort) => {
        if (limit <= 0) {
            await accessManager.createRecords("Get fallido - limit menor a 0");
            return {
                status: 400,
                message: {
                    status: "error",
                    error: `Limite debe ser mayor a 0(cero)`
                }
            };
        }
        await accessManager.createRecords(`Consulta los productos`);
        let filter = {};
        let sortOrder = sort === '-1' ? -1 : 1;
        let sortOption = {};
        if (category !== 'all') {
            filter.category = category;
            sortOption.price = sortOrder;
        }
        if (stock !== 'all') {
            filter.status = stock;
            sortOption.price = sortOrder;
        }
        if (sort !== 'none') {
            sortOption.price = sortOrder;
        }
        const data = await productModel.paginate(filter, { limit, page, sort: sortOption });
        const prevLink = data.hasPrevPage ? `/products?page=${data.prevPage}&limit=${limit}&category=${category}&stock=${stock}&sort=${sort}` : null;
        const nextLink = data.hasNextPage ? `/products?page=${data.nextPage}&limit=${limit}&category=${category}&stock=${stock}&sort=${sort}` : null;
        return {
            status: 200,
            message: {
                status: "success",
                payload: data.docs,
                totalPages: data.totalPages,
                prevPage: data.prevPage,
                nextPage: data.nextPage,
                hasPrevPage: data.hasPrevPage,
                hasNextPage: data.hasNextPage,
                prevLink,
                nextLink
            }
        };
    };
    getProducts = async (limit) => {
        if (limit) {
            if (isNaN(limit) || parseInt(limit) <= 0) {
                await accessManager.createRecords("Get fallido - limit erroneo");
                return {
                    status: 400,
                    message: {
                        status: "error",
                        error: `Limit error`
                    }
                }

            }
            await accessManager.createRecords(`Consulta los productos los primeros ${limit} productos`);
            const payload = await productModel.find().limit(limit)
            return {
                status: 200,
                message: {
                    status: "success",
                    payload
                }
            }
        } else {
            await accessManager.createRecords("Consulta los productos");
            const payload = await productModel.find();
            return {
                status: 200,
                message: {
                    status: "success",
                    payload
                }
            }
        }
    };
    getProductById = async (id) => {
        try {
            const payload = await productModel.find({ _id: id });
            if (payload.length > 0) {
                await accessManager.createRecords(`Consulta el producto id: ${id}`);
                return {
                    status: 200,
                    message: {
                        status: "success",
                        payload
                    }
                }
            }
            await accessManager.createRecords(`Get fallido - id inexistente`);
            return {
                status: 400,
                message: {
                    status: "error",
                    error: `El producto con id:${id} no existe`
                }
            }
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: error.message,
                },
            };
        }

    };
    deleteProduct = async (pid, userEmail) => {
        try {
            const user = await userModel.findOne({ mail: userEmail });
            console.log('primera verificacion', user.role);
            if (user.role === 'premium' || user.role === 'admin') {
                const product = await productModel.findById(pid)
                console.log('segunda verificacion', user.id, product.owner);
                if (user.id == product.owner || user.role === 'admin') {
                    const payload = await productModel.deleteOne({ _id: pid });
                    if (payload.deletedCount == 1) {
                        await accessManager.createRecords(`Elimina el producto id: ${pid}`);
                        return {
                            status: 200,
                            message: {
                                status: "success",
                                payload,
                            }
                        }
                    }
                } else {
                    console.log(`No puedes eliminar producto con id:${pid}`);
                    await accessManager.createRecords(`Delete fallido - id inexistente`);
                    return {
                        status: 400,
                        message: {
                            status: "error",
                            error: `No puedes eliminar producto con id:${pid}`
                        }
                    }
                }
            } else {
                await accessManager.createRecords(`Delete fallido - id inexistente`);
                return {
                    status: 400,
                    message: {
                        status: "error",
                        error: `No posees los permisos correspondientes`
                    }
                }
            }
        } catch (error) {
            return {
                status: 400,
                message: {
                    status: "error",
                    error: error.message
                }
            }
        }
    };
    // addProduct = async (newProduct) => {

    //     const { code } = newProduct;
    //     const data = await this.correctData(newProduct);
    //     if (data != "success") {
    //         await accessManager.createRecords(`Post fallido - falta: ${data.join(", ")}`);
    //         return {
    //             status: 400,
    //             message: {
    //                 status: "error",
    //                 error: `falta: ${data.join(", ")}`,
    //             }
    //         }
    //     }
    //     const repeat = await this.codeRepeat(code);
    //     if (repeat) {
    //         await accessManager.createRecords(`Post fallido - codigo se repite`);
    //         return {
    //             status: 400,
    //             repeat
    //         }
    //     }
    //     await accessManager.createRecords(`Post correcto - se agrego ${newProduct.title}`);
    //     const payload = await productModel.create(newProduct);
    //     return {
    //         status: 200,
    //         message: {
    //             status: "success",
    //             payload,
    //         }
    //     }
    // }
    addProduct = async (newProduct, ownerEmail) => {
        try {
            let errors = [];
            const keys = ["title", "description", "price", "thumbnail", "code", "stock", "category"];
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                if (!newProduct.hasOwnProperty(key) || newProduct[key] == null || newProduct[key] == undefined || newProduct[key] == "" || newProduct[key] == " ") {
                    errors.push("El objeto no tiene la propiedad " + key + " o su valor es nulo, indefinido o vacío.");
                }
            }
            if (errors.length > 0) {
                return {
                    status: 400,
                    message: {
                        status: "error_json",
                        error: errors
                    }
                }
            }
            const { code } = newProduct;
            const repeat = await this.codeRepeat(code);
            if (repeat) {
                await accessManager.createRecords(`Post fallido - codigo se repite`);
                return {
                    status: 400,
                    message: {
                        status: "error_code",
                        error: ["El code se repite"]
                    }

                }
            }
            await accessManager.createRecords(`Post correcto - se agrego ${newProduct.title}`);
            const { id } = await userModel.findOne({ mail: ownerEmail });
            newProduct.owner = id;
            const payload = await productModel.create(newProduct);
            return {
                status: 200,
                message: {
                    status: "success",
                    payload,
                }
            }
        } catch (error) {
            console.log(error.message);
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
    };
    updateProduct = async (pid, newData, userEmail) => {
        try {
            const user = await userModel.findOne({ mail: userEmail });
            console.log('primera verificacion', user.role);
            if (user.role === 'premium' || user.role === 'admin') {
                const product = await productModel.findById(pid)
                console.log('segunda verificacion', user.id, product.owner);
                if (user.id == product.owner || user.role === 'admin') {
                    let editValues = await this.conditionData(newData); //acondiciona datos, elimina vacios y undefined
                    if (editValues.code) {
                        const repeat = await this.codeRepeat(editValues.code);
                        if (repeat) {
                            await accessManager.createRecords(`Put fallido codigo se repite`);
                            return {
                                status: 400,
                                message: repeat
                            }
                        }
                    }// detecta si el codigo se repite
                        await accessManager.createRecords(`Modifica el producto id: ${pid}`);
                        const payload = await productModel.updateOne({ _id: pid }, { $set: editValues });
                        return {
                            status: 200,
                            message: {
                                status: "success",
                                payload
                            }
                        }
                } else {
                    console.log(`No puedes editar producto con id:${pid}`);
                    await accessManager.createRecords(`Edit fallido`);
                    return {
                        status: 400,
                        message: {
                            status: "error",
                            error: `Usted no puedes editar producto con id:${pid}`
                        }
                    }
                }
            } else {
                await accessManager.createRecords(`Edit fallido`);
                return {
                    status: 400,
                    message: {
                        status: "error",
                        error: `No posees los permisos correspondientes`
                    }
                }
            }   
        }
     catch(error) {
        return {
            status: 400,
            message: {
                status: "error",
                error: error.message
            }
        }
    }
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
    };
    updateStock = async (productId, quantity) => {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                return {
                    status: 400,
                    message: {
                        status: "error",
                        error: `El producto con id:${productId} no existe`,
                    },
                };
            }
            const newStock = product.stock - quantity;
            if (newStock < 0) {
                return {
                    status: 400,
                    message: {
                        status: "error",
                        error: `No hay suficiente stock disponible para agregar ${quantity} productos`,
                        stock: false
                    },
                };
            }

            product.stock = newStock;
            product.status = newStock > 0;
            await product.save();
            return {
                status: 200,
                message: {
                    status: "success",
                    message: `Se actualizó el stock del producto con id:${productId}`,
                    stock: true
                },
            };
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: error.message,
                },
            };
        }
    };
    mockingproducts = async (cantidad, ownerEmail) => {
        try {
            for (let index = 0; index < cantidad; index++) {
                let product = generateProduct()
                await this.addProduct(product, ownerEmail);
            }
            return {
                status: 200,
                message: `se crearon ${cantidad} productos`,
            };
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: error.message,
                },
            };
        }
    }
}