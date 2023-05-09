import AccessManager from "./AccessManager.js";
import cartModel from "../models/cart.model.js";

const accessManager = new AccessManager();

export default class cartManager{

    getCarts = async () =>{
        await accessManager.createRecords("Consulta los carritos");
        const payload = await cartModel.find()
        return {
            status: 200,
            smg: {
                status: "success",
                payload
            }
        }
    }

    addCart = async () => {
        const payload = await cartModel.create({});
        return {
            status: 200,
            smg: {
                status: "success",
                payload,
            }
        }
    }

    getCartById = async (id) => {
        const cart = await cartModel.find({ _id: id }).populate('products.productId');
        if (cart.length > 0) {
            // const payload = JSON.stringify(cart,null,"\t");
            return {
                status: 200,
                smg: {
                    status: "success",
                    cart
                }
            }
        }
        return {
            status: 400,
            smg: {
                status: "error",
                error: `El cart con id:${id} no existe`
            }
        }

    }

    addProductToCart = async (cid, pid) => {
        const cart = await cartModel.find({ _id: cid });
        let exist = false;
        cart[0].products.forEach( el =>{
            if(el.productId == pid){
                el.quantity++;
                exist = true; 
            }   
        })
        if(exist){
            console.log('se actualizo');
            const result = await cartModel.updateOne({_id:cid},{$set:cart[0]});
            return {
            status: 200,
            smg: {
                status: "success",
                result
            }
        }
        }
        cart[0].products.push({productId: pid, quantity: 1})
        const result = await cartModel.updateOne({_id:cid},{$set:cart[0]});
        console.log('se creo');
        return {
            status: 200,
            smg: {
                status: "success",
                result
            }
        }
    }
}