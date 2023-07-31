import userModel from "../../models/user.model.js";
import { userRoles } from "../../../constants/index.js";

export class UserMongo {
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