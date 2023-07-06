export class CartRepository{
    constructor(dao){
        this.dao = dao;
    }
    getCarts = async () =>{
        return await this.dao.getCarts();
    }
    getCartById = async (id) =>{
        return await this.dao.getCartById(id);
    }
    addCart = async () => {
        return await this.dao.addCart();
    }
    addProductToCart = async (cid, pid) =>{
        return await this.dao.addProductToCart(cid, pid)
    }
    updateProductQuantity = async (cid, pid, cantidad) =>{
        return await this.dao.updateProductQuantity(cid, pid, cantidad)
    }
    deleteProductOnCart = async (cid, pid) =>{
        return await this.dao.deleteProductOnCart(cid, pid)
    }
    deleteAllProductsFromCart = async (cid)=>{
        return await this.dao.deleteAllProductsFromCart(cid)
    }
    createOrder = async (cid)=>{
        return await this.dao.createOrder(cid)
    }
}