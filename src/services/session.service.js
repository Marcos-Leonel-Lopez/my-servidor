import { sessionPersistence } from "../Dao/factory.js";

export default class SessionService{
    getUsers = async () =>{
        return await sessionPersistence.getUsers();
    }
    deleteUser = async (sid) =>{
        return await sessionPersistence.deleteUser(sid);
    }
    getUser = async (email) =>{
        return sessionPersistence.getUser(email);
    }
    updatePassword = async (user, newHashedPass) =>{
        return sessionPersistence.updatePassword(user, newHashedPass);
    }
}