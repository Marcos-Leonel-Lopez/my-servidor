import AccessManager from "./AccessManager.js";
import cartModel from "../models/cart.model.js";
import ValidationManager from "./ValidationManager.js";

const accessManager = new AccessManager();
const validationManager = new ValidationManager();

export default class cartManager {

    getCarts = async () => {
        try {
            await accessManager.createRecords("Consulta los carritos");
            const payload = await cartModel.find();
            return {
                status: 200,
                smg: {
                    status: "success",
                    payload
                }
            };
        } catch (error) {
            return {
                status: 500,
                smg: {
                    status: "error",
                    error: error.message
                }
            };
        }
    };


    addCart = async () => {
        try {
            const payload = await cartModel.create({});
            return {
                status: 200,
                smg: {
                    status: "success",
                    payload,
                }
            };
        } catch (error) {
            return {
                status: 500,
                smg: {
                    status: "error",
                    error: error.message
                }
            };
        }
    };


    getCartById = async (id) => {
        try {
            const cart = await cartModel.findById(id).populate('products.productId');
            if (cart) {
                return {
                    status: 200,
                    smg: {
                        status: "success",
                        cart
                    }
                };
            }
            return {
                status: 400,
                smg: {
                    status: "error",
                    error: `El cart con id:${id} no existe`
                }
            };
        } catch (error) {
            return {
                status: 500,
                smg: {
                    status: "error",
                    error: error.message
                }
            };
        }
    };


    addProductToCart = async (cid, pid) => {
        try {
            const cart = await cartModel.findOneAndUpdate(
                { _id: cid, "products.productId": pid },
                { $inc: { "products.$.quantity": 1 } },
                { new: true }
            );

            if (cart) {
                // Stock validation and update
                const stockUpdate = await validationManager.updateStock(pid, 1);
                if (stockUpdate.status !== 200) {
                    return stockUpdate;
                }
                return {
                    status: 200,
                    smg: {
                        status: "success",
                        result: cart
                    }
                };
            }

            const updatedCart = await cartModel.findByIdAndUpdate(
                cid,
                { $push: { products: { productId: pid, quantity: 1 } } },
                { new: true }
            );

            // Stock validation and update
            const stockUpdate = await validationManager.updateStock(pid, 1);
            if (stockUpdate.status !== 200) {
                return stockUpdate;
            }

            return {
                status: 200,
                smg: {
                    status: "success",
                    result: updatedCart
                }
            };
        } catch (error) {
            return {
                status: 500,
                smg: {
                    status: "error",
                    error: "error en los datos ingresados"
                }
            };
        }
    };


    deleteProductOnCart = async (cid, pid) => {
        try {
            const result = await cartModel.findOneAndUpdate({ _id: cid }, { $pull: { products: { productId: pid } } }, { new: true });
            console.log('se debe haber eliminado');
            return {
                status: 200,
                smg: {
                    status: "success",
                    result
                }
            }
        } catch (error) {
            return {
                status: 500,
                smg: {
                    status: "error",
                    error: "error en los datos ingresados"
                }
            }
        }

    }

    updateProductQuantity = async (cid, pid, cantidad) => {
        try {
            if (typeof cantidad !== 'number' || cantidad <= 0) {
                return {
                    status: 400,
                    smg: {
                        status: "error",
                        error: "La cantidad debe ser un número positivo"
                    }
                };
            }
            const stockUpdate = await validationManager.updateStock(pid, cantidad);
            if (stockUpdate.status !== 200) {
                return stockUpdate;
            }
            const cart = await cartModel.findOne({ _id: cid });
            if (!cart) {
                return {
                    status: 400,
                    smg: {
                        status: "error",
                        error: `El carrito con id:${cid} no existe`
                    }
                };
            }
            const productIndex = cart.products.findIndex(product => product.productId == pid);
            if (productIndex === -1) {
                return {
                    status: 400,
                    smg: {
                        status: "error",
                        error: `El producto con id:${pid} no se encontró en el carrito con id:${cid}`
                    }
                };
            }
            const product = cart.products[productIndex];
            const updatedQuantity = product.quantity + cantidad;
            product.quantity = updatedQuantity;
            await cart.save();
            return {
                status: 200,
                smg: {
                    status: "success",
                    result: cart
                }
            };
        } catch (error) {
            return {
                status: 500,
                smg: {
                    status: "error",
                    error: error.message
                }
            };
        }
    };







    deleteAllProductsFromCart = async (cid) => {
        try {
            const updatedCart = await cartModel.findByIdAndUpdate(
                cid,
                { $set: { products: [] } },
                { new: true }
            );

            return {
                status: 200,
                smg: {
                    status: "success",
                    result: updatedCart
                }
            };
        } catch (error) {
            return {
                status: 500,
                smg: {
                    status: "error",
                    error: error.message
                }
            };
        }
    };


}