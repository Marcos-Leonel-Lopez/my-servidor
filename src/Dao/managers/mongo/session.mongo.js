import userModel from "../../models/user.model.js";

export class SessionMongo{
    getUsers = async () =>{
        try {
            const payload = await userModel.find();
            return {
                status: 200,
                message: {
                    status: "success",
                    payload
                }
            };
        }catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: error.message
                }
            };
        }
    }
    deleteUser = async (sid) =>{
        try {
            const payload = await userModel.deleteOne({_id: sid});
            if (payload.deletedCount === 1) {
                return {
                  status: 200,
                  message: {
                    status: "success",
                    payload,
                  }
                };
            }   
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: error.message
                }
            };
        }
    }
    getUser = async (email) =>{
        try {
            // const user = await userModel.findOne({ mail: email }).populate({ path: 'cart',populate: { path: 'products.productId', model: productModel}}); // populate de todo
            // return await userModel.findOne({ mail:email }).populate('cart');
            const user = await userModel.findOne({ mail:email })
            if(user){
                return {
                    status: 200,
                    message: {
                      status: "success",
                      user
                    }
                  };
            }
            return {
                status: 400,
                message: {
                  status: "error",
                  error : "user inexistente"
                }
              }; 
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: error.message
                }
            }; 
        }
        
    }
    updatePassword = async (user, newHashedPass) =>{
        return await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPass } });
    }
}