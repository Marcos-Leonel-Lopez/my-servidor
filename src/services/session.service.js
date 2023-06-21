import SessionDao from "../persistence/session.dao.js";

const sessionDao = new SessionDao();

export default class SessionService{
    getUser = async (email) =>{
        return sessionDao.getUser(email);
    }
    updatePassword = async (user, newHashedPass) =>{
        return sessionDao.updatePassword(user, newHashedPass);
    }
}