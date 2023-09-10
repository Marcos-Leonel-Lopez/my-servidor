import productModel from "../Dao/models/product.model.js";
import userModel from "../Dao/models/user.model.js";
import { date } from "../utils.js";

export const updateOwner = async () =>{
    try {
        const adminId = '64e163c959dcd7d0aaeee043';
        const result = await productModel.updateMany({},{$set:{owner:adminId}})
        console.log(result);
    } catch (error) {
        console.log(error.message);
    }
}

export const updateLC = async() =>{
    try {
        const fecha = await date();
        const result = await userModel.updateMany({},{$set:{last_connection:{login:fecha}}});
        console.log(result);
    } catch (error) {
        console.log(error.message);
    }
}