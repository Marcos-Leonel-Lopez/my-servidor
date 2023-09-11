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
    deleteUser = async () =>{
        return await this.dao.deleteUser();
    }
    changeRole = async (uid) =>{
        return await this.dao.changeRole(uid);
    }
    updateUserDocuments = async (uid,identificacion,comprobanteDomicilio,estadoCuenta) =>{
        return await this.dao.updateUserDocuments(uid,identificacion,comprobanteDomicilio,estadoCuenta);
    }
    panelAdmin = async (limit, page, role) =>{
        return await this.dao.panelAdmin(limit, page, role)
    }

}