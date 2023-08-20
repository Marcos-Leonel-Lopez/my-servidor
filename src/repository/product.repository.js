export class ProductRepository{
    constructor(dao){
        this.dao = dao;
    }
    getProductsPage = async (limit, page, category, stock, sort) =>{
        return await this.dao.getProductsPage(limit, page, category, stock, sort)
    }
    getProducts = async (limit) =>{
        return await this.dao.getProducts(limit)
    }
    getProductById = async (id) =>{
        return await this.dao.getProductById(id)  
    }
    deleteProduct = async (id,userEmail) =>{
        return await this.dao.deleteProduct(id,userEmail);
    }
    addProduct = async (newProduct,ownerEmail) =>{
        return await this.dao.addProduct(newProduct,ownerEmail);
    }
    addProductRealTime = async (newProduct,ownerEmail) =>{
        console.log('addProductRealTime');
        return await this.dao.addProduct(newProduct,ownerEmail);
    }
    updateProduct = async (id, newData, userEmail)=>{
        return await this.dao.updateProduct(id, newData, userEmail)
    }
    correctData = async (newProduct)=>{
        return await this.dao.correctData(newProduct)
    }
    updateStock = async (productId, quantity) => {
        return await this.dao.updateStock(productId, quantity)
    }
    mockingproducts = async (cantidad,ownerEmail) =>{
        return await this.dao.mockingproducts(cantidad,ownerEmail)
    }
    updateProductDocuments = async (code,userEmail,img_1,img_2,img_3,img_4,img_5) =>{
        return await this.dao.updateProductDocuments(code,userEmail,img_1,img_2,img_3,img_4,img_5)
    }
}