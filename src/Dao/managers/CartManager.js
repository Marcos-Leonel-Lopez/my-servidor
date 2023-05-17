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
                console.log('se actualizó');
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

    updateProductQuantity = async (cid, pid, quantity) => {
        try {
            if (typeof quantity !== 'number' || quantity <= 0) {
                return {
                    status: 400,
                    smg: {
                      status: "error",
                      error: "La cantidad debe ser un número positivo"
                    }
                  }
              }
          const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cid, "products.productId": pid },
            { $set: { "products.$.quantity": quantity } },
            { new: true }
          );
          if (updatedCart) {
            return {
              status: 200,
              smg: {
                status: "success",
                result: updatedCart
              }
            };
          }
          return {
            status: 400,
            smg: {
              status: "error",
              error: `El producto con id:${pid} no se encontró en el carrito con id:${cid}`
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