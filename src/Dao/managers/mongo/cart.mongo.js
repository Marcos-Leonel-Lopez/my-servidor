import { date } from "../../../utils.js";
import cartModel from "../../models/cart.model.js";
import productModel from "../../models/product.model.js";
import userModel from "../../models/user.model.js";
import AccessManager from "../AccessManager.js";
import { ProductMongo } from "./product.mongo.js";
import { TicketMongo } from "./ticket.mongo.js";



const accessManager = new AccessManager();
const productMongo = new ProductMongo();
const ticketMongo = new TicketMongo();

export class CartMongo {
    getCarts = async () => {
        try {
            await accessManager.createRecords("Consulta los carritos");
            const payload = await cartModel.find();
            return {
                status: 200,
                message: {
                    status: "success",
                    payload
                }
            };
        } catch (error) {
            return {
                status: 500,
                message: {
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
                    message: {
                        status: "success",
                        cart
                    }
                };
            }
            return {
                status: 400,
                message: {
                    status: "error despues del return",
                    error: `El cart con id:${id} no existe`
                }
            };
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error en catch",
                    error: `El cart con id:${id} no existe`
                }
            };
        }
    };
    addCart = async () => {
        try {
            const payload = await cartModel.create({});
            return {
                status: 200,
                message: {
                    status: "success",
                    payload,
                }
            };
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: error.message
                }
            };
        }
    };
    addProductToCart = async (cid, pid) => {
        try {
            const user = await userModel.findOne({cart:cid});
            if(user.role === 'premium'){
                const product = await productModel.findById(pid)
                if(user.id == product.owner){
                    console.log('pertenece a esta persona');
                    return {
                        status: 400,
                        message: {
                            status: "error",
                            error: "No puede agregar este producto porque es de su pertenecia"
                        }
                    };
                }
            }
            const cart = await cartModel.findOneAndUpdate(
                { _id: cid, "products.productId": pid },
                { $inc: { "products.$.quantity": 1 } },
                { new: true }
            );
            if (cart) {
                return {
                    status: 200,
                    message: {
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
                message: {
                    status: "success",
                    result: updatedCart
                }
            };
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: "error en los datos ingresados"
                }
            };
        }
    };
    updateProductQuantity = async (cid, pid, cantidad) => {
        try {
            const user = await userModel.findOne({cart:cid});
            if(user.role === 'premium'){
                const product = await productModel.findById(pid)
                console.log(user.id , product.owner,user.id == product.owner);
                if(user.id == product.owner){
                    console.log('pertenece a esta persona');
                    return {
                        status: 400,
                        message: {
                            status: "error",
                            error: "No puede agregar este producto porque es de su pertenecia"
                        }
                    };
                }
            }
            if (typeof cantidad !== 'number' || cantidad <= 0) {
                return {
                    status: 400,
                    message: {
                        status: "error",
                        error: "La cantidad debe ser un número positivo"
                    }
                };
            }
            const cart = await cartModel.findOne({ _id: cid });
            if (!cart) {
                return {
                    status: 400,
                    message: {
                        status: "error",
                        error: `El carrito con id:${cid} no existe`
                    }
                };
            }
            const productIndex = cart.products.findIndex(product => product.productId == pid);
            if (productIndex === -1) {
                return {
                    status: 400,
                    message: {
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
                message: {
                    status: "success",
                    result: cart
                }
            };
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: 'error en datos ingresados'
                }
            };
        }
    };
    deleteProductOnCart = async (cid, pid) => {
        try {
            const result = await cartModel.findOneAndUpdate({ _id: cid }, { $pull: { products: { productId: pid } } }, { new: true });
            return {
                status: 200,
                message: {
                    status: "success",
                    result
                }
            }
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: "error en los datos ingresados"
                }
            }
        }
    }
    deleteAllProductsFromCart = async (cid) => {
        try {
            const updatedCart = await cartModel.findByIdAndUpdate(
                cid,
                { $set: { products: [] } },
                { new: true }
            );

            return {
                status: 200,
                message: {
                    status: "success",
                    result: updatedCart
                }
            };
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: error.message
                }
            };
        }
    };

    createOrder = async (id) => {
        try {
            let amount = 0;
            const cart = await cartModel.findById(id);
            const user = await userModel.find({ cart: id })
            const remainder = []
            const { products } = cart
            for (const unit of products) {
                try {
                    const product = await productMongo.getProductById(unit.productId);
                    if (product.message.payload[0].stock >= unit.quantity) {
                        amount = amount + product.message.payload[0].price * unit.quantity
                    } else {
                        remainder.push(unit);
                    }
                    const newStock = await productMongo.updateStock(product.message.payload[0].id, unit.quantity);
                } catch (error) {
                    console.error('Error al obtener el producto', error);
                }
            }
            let time = await date();
            let ticket = {
                code: '',
                purchase_datetime: time,
                amount: amount,
                purchaser: user[0].mail
            }
            const order = await ticketMongo.createTicket(ticket);
            cart.products = remainder;
            await cart.save();
            return {
                status: 200,
                message: {
                    orden: order,
                    noProcess: cart
                }
            };

        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error aqui",
                    error: error.message
                }
            };
        }
    }
}