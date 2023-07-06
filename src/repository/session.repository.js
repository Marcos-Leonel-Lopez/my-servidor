export class SessionRepository{
    constructor(dao){
        this.dao = dao;
    }
    getUsers = async () =>{
        return await this.dao.getUsers();
    }
    deleteUser = async (sid) =>{
        return await this.dao.deleteUser(sid);
    }
    getUser = async (email) =>{
        return this.dao.getUser(email);
    }
    updatePassword = async (user, newHashedPass) =>{
        return this.dao.updatePassword(user, newHashedPass);
    }
}