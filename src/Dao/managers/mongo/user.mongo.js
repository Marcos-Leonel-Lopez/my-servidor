import userModel from "../../models/user.model.js";
import productModel from "../../models/product.model.js";
import { sendProductDelete } from "../../../config/gmail.js";
import { userRoles, mediaHora, dosDias } from "../../../constants/index.js";
import { date } from "../../../utils.js";


export class UserMongo {
    getUsers = async () => {
        try {
            const users = await userModel.find();
            const payload = users.map(user => {
                return user = {
                    name: `${user.first_name} ${user.last_name}`,
                    email: `${user.mail}`,
                    age: `${user.age}`,
                    role: `${user.role}`
                }
            })
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
    deleteUserTime = async () => {
        try {
            const currentDate = await date();
            const users = await userModel.find();
            const deletedUserData = [];
            for (const user of users) {
                const lastLogin = new Date(user.last_connection.login);
                const time_diff = currentDate - lastLogin;
                if (time_diff >= mediaHora) { // mediaHora : 30 min o dosDias : 2 dias
                    if (user.role === 'admin') {
                        continue; // al admin y no se lo considera`
                    }
                    const productsToDelete = await productModel.find({ owner: user.id });
                    const userData = {
                        userId: user.id,
                        userName: user.name,
                        deletedProducts: []
                    };
                    for (const product of productsToDelete) {
                        userData.deletedProducts.push({
                            title: product.title,
                            code: product.code
                        });
                        await productModel.deleteOne({ _id: product._id });
                    }
                    await sendProductDelete(user.mail);
                    deletedUserData.push(userData);
                    await userModel.deleteOne({ _id: user._id });
                }
            }
            if (deletedUserData.length === 0) {
                return {
                    status: 200,
                    message: {
                        status: "success",
                        info: "No se eliminaron usuarios."
                    }
                };
            }
            return {
                status: 200,
                message: {
                    status: "success",
                    usersAndProductsDelete: deletedUserData
                }
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
    changeRole = async (uid) => {
        try {
            const user = await userModel.findById(uid)
            const userRole = user.role;
            const userStatus = user.status;
            if (userStatus === 'completo') {
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
            } else {
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
    updateUserDocuments = async (uid, identificacion, comprobanteDomicilio, estadoCuenta) => {
        try {
            const user = await userModel.findById(uid);
            const docs = [];
            if (identificacion) {
                docs.push({
                    name: 'identificacion',
                    reference: identificacion.filename
                })
            }
            if (comprobanteDomicilio) {
                docs.push({
                    name: 'comprobanteDomicilio',
                    reference: comprobanteDomicilio.filename
                })
            }
            if (estadoCuenta) {
                docs.push({
                    name: 'estadoCuenta',
                    reference: estadoCuenta.filename
                })
            }
            if (docs.length == 3) {
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
    panelAdmin = async (limit, page, role) => {
        try {
            if (limit <= 0) {
                return {
                    status: 400,
                    message: {
                        status: "error",
                        error: `Limite debe ser mayor a 0(cero)`
                    }
                };
            };
            let filter = {};
            if (role !== 'all') {
                filter.role = role;
            }
            const data = await userModel.paginate(filter, { limit, page })
            const prevLink = data.hasPrevPage ? `/panelAdmin?page=${data.prevPage}&limit=${limit}&role=${role}` : null;
            const nextLink = data.hasNextPage ? `/panelAdmin?page=${data.nextPage}&limit=${limit}&role=${role}` : null;
            return {
                status: 200,
                message: {
                    status: "success",
                    payload: data.docs,
                    totalPages: data.totalPages,
                    prevPage: data.prevPage,
                    nextPage: data.nextPage,
                    hasPrevPage: data.hasPrevPage,
                    hasNextPage: data.hasNextPage,
                    prevLink,
                    nextLink
                }
            }
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
    deleteUser = async (uid) => {
        try {
            const {role} = await userModel.findById(uid);
            if(role == 'admin'){
                return {
                    status: 400,
                    message: {
                        status: "error",
                        error: `No se puede eliminar al Admin`
                    }
                }
            }
            const data = await userModel.deleteOne({ _id: uid })
            if (data.deletedCount == 1) {
                return {
                    status: 200,
                    message: {
                        status: "success",
                        data
                    }
                }
            }
            return {
                status: 400,
                message: {
                    status: "error",
                    error: `El user con id:${id} no existe`
                }
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
}