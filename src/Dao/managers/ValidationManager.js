import productModel from "../models/product.model.js";

export default class ValidationManager{

    codeRepeat = async (code) =>{
        let result = await productModel.find({code: code});
        if(result.length > 0){
            return true;
        }
        return false;
    };

    correctData = async (product) => {
        let mData = [];
        let obj = Object.entries(product);
         obj.forEach((el) => {
             if (el[1] == "") {
                 if(el[0] != 'thumbnail'){
                    mData.push(el[0]); // cambio para evitar que valide el campo thumbnail
                 }
             }
         });
         if(mData.length > 0){
            return mData
         }
         return 'success'
    }


}