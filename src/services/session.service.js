// import SessionMongo from "../Dao/managers/mongo/session.mongo.js";
import { sessionPersistence } from "../Dao/factory.js";

// const sessionMongo = new SessionMongo();

export default class SessionService{
    getUser = async (email) =>{
        return sessionPersistence.getUser(email);
    }
    updatePassword = async (user, newHashedPass) =>{
        return sessionPersistence.updatePassword(user, newHashedPass);
    }
}