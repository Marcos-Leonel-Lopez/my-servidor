export class UserRepository{
    constructor(dao){
        this.dao = dao;
    }
    getUsers = async () =>{
        return await this.dao.getUsers();
    }
    getUser = async (uid) =>{
        return await this.dao.getUser(uid);
    }
    deleteUser = async (uid) =>{
        return await this.dao.deleteUser(uid);
    }
    changeRole = async (uid) =>{
        return await this.dao.changeRole(uid);
    }
    updateUserDocuments = async (uid,identificacion,ticketPagado) =>{
        return await this.dao.updateUserDocuments(uid,identificacion,ticketPagado);
    }
}