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
}