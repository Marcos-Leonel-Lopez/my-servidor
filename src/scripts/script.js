import productModel from "../Dao/models/product.model.js";


export const updateOwner = async () =>{
    try {
        const adminId = '64a1298cb19875eef3f115fc';
        const result = await productModel.updateMany({},{$set:{owner:adminId}})
        console.log(result);
    } catch (error) {
        console.log(error.message);
    }
}