import { cartPersistence } from "../Dao/factory.js";

export default class CartService{
    
    getCarts = async () =>{
        return await cartPersistence.getCarts();
    }
    getCartById = async (id) =>{
        return await cartPersistence.getCartById(id);
    }
    addCart = async () => {
        return await cartPersistence.addCart();
    }
    addProductToCart = async (cid, pid) =>{
        return await cartPersistence.addProductToCart(cid, pid)
    }

    updateProductQuantity = async (cid, pid, cantidad) =>{
        return await cartPersistence.updateProductQuantity(cid, pid, cantidad)
    }

    deleteProductOnCart = async (cid, pid) =>{
        return await cartPersistence.deleteProductOnCart(cid, pid)
    }

    deleteAllProductsFromCart = async (cid)=>{
        return await cartPersistence.deleteAllProductsFromCart(cid)
    }

    createOrder = async (cid)=>{
        return await cartPersistence.createOrder(cid)
    }
    
}