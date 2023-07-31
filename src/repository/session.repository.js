export class SessionRepository{
    constructor(dao){
        this.dao = dao;
    }
    restartPassword = async (mail, password, token) =>{
        return await this.dao.restartPassword(mail, password, token);
    }
    forgotPassword = async (mail)=>{
        return await this.dao.forgotPassword(mail)
    }
    // getUsers = async () =>{
    //     return await this.dao.getUsers();
    // }
    // deleteUser = async (sid) =>{
    //     return await this.dao.deleteUser(sid);
    // }
    // getUser = async (email) =>{
    //     return this.dao.getUser(email);
    // }
    // updatePassword = async (user, newHashedPass) =>{
    //     return this.dao.updatePassword(user, newHashedPass);
    // }
}