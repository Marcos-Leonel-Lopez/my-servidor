import ProductDao from "../persistence/product.dao.js"

const productDao = new ProductDao();

export default class ProductService{
    getProductsPage = async (limit, page, category, stock, sort) =>{
        return await productDao.getProductsPage(limit, page, category, stock, sort)
    }
    getProducts = async (limit) =>{
        console.log(limit);
        return await productDao.getProducts(limit)
    }
    getProductById = async (id) =>{
        return await productDao.getProductById(id)  
    }
    deleteProduct = async (id) =>{
        return await productDao.deleteProduct(id);
    }
    addProduct = async (newProduct) =>{
        return await productDao.addProduct(newProduct);
    }
    updateProduct = async (id, newData)=>{
        return await productDao.updateProduct(id, newData)
    }
}