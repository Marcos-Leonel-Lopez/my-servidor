import CartMongo from "../Dao/managers/mongo/cart.mongo.js";

const cartMongo = new CartMongo();

export default class CartService{
    getCarts = async () =>{
        return await cartMongo.getCarts();
    }
    getCartById = async (id) =>{
        return await cartMongo.getCartById(id);
    }
    addCart = async () => {
        return await cartMongo.addCart();
    }
    addProductToCart = async (cid, pid) =>{
        return await cartMongo.addProductToCart(cid, pid)
    }

    updateProductQuantity = async (cid, pid, cantidad) =>{
        return await cartMongo.updateProductQuantity(cid, pid, cantidad)
    }

    deleteProductOnCart = async (cid, pid) =>{
        return await cartMongo.deleteProductOnCart(cid, pid)
    }

    deleteAllProductsFromCart = async (cid)=>{
        return await cartMongo.deleteAllProductsFromCart(cid)
    }
}