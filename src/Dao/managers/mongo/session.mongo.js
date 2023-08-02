import userModel from "../../models/user.model.js";
import { createHash, generateEmailToken, validatePass, verifyEmailToken } from "../../../utils.js";
import { sendRecoveryPass } from "../../../config/gmail.js";

export class SessionMongo {
    getUsers = async () => {
        try {
            const payload = await userModel.find();
            return {
                status: 200,
                message: {
                    status: "success",
                    payload
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
    deleteUser = async (sid) => {
        try {
            const payload = await userModel.deleteOne({ _id: sid });
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
    getUser = async (email) => {
        try {
            // const user = await userModel.findOne({ mail: email }).populate({ path: 'cart',populate: { path: 'products.productId', model: productModel}}); // populate de todo
            // return await userModel.findOne({ mail:email }).populate('cart');
            const user = await userModel.findOne({ mail: email })
            if (user) {
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
                    error: "user inexistente"
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
    restartPassword = async (mail, password, token) => {
        try {
            console.log(mail, password, token, ' en .mongo ');
            let validEmail= true;
            if (!mail || !password || !token) {
                return {
                    status: 400,
                    message:{
                        status: 'error',
                        error: 'Faltan datos'
                    }
                }
            } 
            validEmail = verifyEmailToken(token)
            console.log('verificacion de token',validEmail);
            if(!validEmail){
                return {
                    status: 400,
                    message:{
                        status: 'error',
                        error: 'Enlace no valido'
                    }
                }
            }
            const user = await userModel.findOne({ mail: mail });
            if(validatePass(password,user)){
                return {
                    status: 400,
                    message:{
                        status: 'error',
                        error: 'No puedes repetir la contraseña'
                    }
                }
            }
            user.password = createHash(password);
            await user.save()
            return{
                status: 200,
                message:{
                    stauts: 'success',
                    message: 'contraseña actualizado'
                }
            }
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: 'error, intente de vuelta'
                }
            };
        }
    }
    forgotPassword = async (mail) => {
        try {
            const user = await userModel.findOne({ mail: mail });
            const token = generateEmailToken(user.mail,3600)
            await sendRecoveryPass(user.mail, token);
            return {
                status: 200,
                message: {
                    status: "success",
                    error: 'Verifique su casilla'
                }
            };
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: 'error, intente de vuelta'
                }
            };
        }
    }
}