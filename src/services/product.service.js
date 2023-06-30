import { productPersistence } from "../Dao/factory.js";


export default class ProductService{
    getProductsPage = async (limit, page, category, stock, sort) =>{
        return await productPersistence.getProductsPage(limit, page, category, stock, sort)
    }
    getProducts = async (limit) =>{
        console.log(limit);
        return await productPersistence.getProducts(limit)
    }
    getProductById = async (id) =>{
        return await productPersistence.getProductById(id)  
    }
    deleteProduct = async (id) =>{
        return await productPersistence.deleteProduct(id);
    }
    addProduct = async (newProduct) =>{
        return await productPersistence.addProduct(newProduct);
    }
    updateProduct = async (id, newData)=>{
        return await productPersistence.updateProduct(id, newData)
    }
}