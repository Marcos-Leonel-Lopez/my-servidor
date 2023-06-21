import CartDao from "../persistence/cart.dao.js";

const cartDao = new CartDao();

export default class CartService{
    getCarts = async () =>{
        return await cartDao.getCarts();
    }
    getCartById = async (id) =>{
        return await cartDao.getCartById(id);
    }
    addCart = async () => {
        return await cartDao.addCart();
    }
    addProductToCart = async (cid, pid) =>{
        return await cartDao.addProductToCart(cid, pid)
    }

    updateProductQuantity = async (cid, pid, cantidad) =>{
        return await cartDao.updateProductQuantity(cid, pid, cantidad)
    }

    deleteProductOnCart = async (cid, pid) =>{
        return await cartDao.deleteProductOnCart(cid, pid)
    }

    deleteAllProductsFromCart = async (cid)=>{
        return await cartDao.deleteAllProductsFromCart(cid)
    }
}