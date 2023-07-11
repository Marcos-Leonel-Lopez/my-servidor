export class ProductRepository{
    constructor(dao){
        this.dao = dao;
    }
    getProductsPage = async (limit, page, category, stock, sort) =>{
        return await this.dao.getProductsPage(limit, page, category, stock, sort)
    }
    getProducts = async (limit) =>{
        console.log(limit);
        return await this.dao.getProducts(limit)
    }
    getProductById = async (id) =>{
        return await this.dao.getProductById(id)  
    }
    deleteProduct = async (id) =>{
        return await this.dao.deleteProduct(id);
    }
    addProduct = async (newProduct) =>{
        return await this.dao.addProduct(newProduct);
    }
    updateProduct = async (id, newData)=>{
        return await this.dao.updateProduct(id, newData)
    }
    updateStock = async (productId, quantity) => {
        return await this.dao.updateStock(productId, quantity)
    }
    mockingproducts = async (cantidad) =>{
        return await this.dao.mockingproducts(cantidad)
    }
}