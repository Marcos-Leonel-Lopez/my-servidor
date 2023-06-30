import SessionMongo from "../Dao/managers/mongo/session.mongo.js";

const sessionMongo = new SessionMongo();

export default class SessionService{
    getUser = async (email) =>{
        return sessionMongo.getUser(email);
    }
    updatePassword = async (user, newHashedPass) =>{
        return sessionMongo.updatePassword(user, newHashedPass);
    }
}