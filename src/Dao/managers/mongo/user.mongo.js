import userModel from "../../models/user.model.js";
import { userRoles } from "../../../constants/index.js";

export class UserMongo {
    getUsers = async () => {
        try {
            const users = await userModel.find();
            
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
    getUser = async (uid) => {
        try {
            const user = await userModel.findById(uid)
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
    deleteUser = async (uid) => {
        try {
            const payload = await userModel.deleteOne({ _id: uid });
            if (payload.deletedCount === 1) {
                return {
                    status: 200,
                    message: {
                        status: "success",
                        payload,
                    }
                };
            }
            return {
                status: 400,
                message: {
                    status: "error",
                    error: payload
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
    changeRole = async (uid) => {
        try {
            const user = await userModel.findById(uid)
            const userRole = user.role;
            const userStatus = user.status;
            if(userStatus === 'completo'){
                if (userRole === 'client') {
                    user.role = 'premium';
                    await user.save()
                } else if (userRole === 'premium') {
                    user.role = 'client';
                    await user.save()
                } else {
                    return {
                        status: 400,
                        message: {
                            status: "error",
                            error: "No es posible cambiar el rol"
                        }
                    };
                }
                return {
                    status: 200,
                    message: {
                        status: "success",
                        user
                    }
                };
            }else{
                return {
                    status: 400,
                    message: {
                        status: "error",
                        error: "Su perfil no está completo"
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
    updateUserDocuments = async (uid,identificacion,comprobanteDomicilio,estadoCuenta) =>{
        try {
            const user = await userModel.findById(uid);
            const docs = [];
            if(identificacion){
                docs.push({
                    name:'identificacion',
                    reference: identificacion.filename
                })
            }
            if(comprobanteDomicilio){
                docs.push({
                    name:'comprobanteDomicilio',
                    reference: comprobanteDomicilio.filename
                })
            }
            if(estadoCuenta){
                docs.push({
                    name:'estadoCuenta',
                    reference: estadoCuenta.filename
                })
            }
            if(docs.length == 3){
                user.status = 'completo'
            }
            user.documents = docs;
            await user.save()
            return {
                status: 200,
                message: {
                    status: 'success',
                    message: 'Documentos actualizados exitosamente',
                    user
                }
            };
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: 'error en carga de archivos'
                }
            };
        }
    }
}