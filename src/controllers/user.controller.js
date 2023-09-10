import {userService} from "../repository/index.repository.js"

export default class UserController{
    getUsers = async (req, res) => {
        try {
            const { status, message } = await userService.getUsers();
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    };
    getUser = async (req,res)=>{
        try {
            const uid = req.params.uid;
            const { status, message } = await userService.getUser(uid);
            return res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);            
        }
    }
    deleteUser = async (req, res)=>{
        try {
            const { status, message } = await userService.deleteUser();
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);            
        }
    }
    changeRole = async ( req,res) =>{
        try {
            const uid = req.params.uid;
            console.log(uid);
            const { status, message } = await userService.changeRole(uid)
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);   
        }
    }
    updateUserDocuments = async (req,res) =>{
        try {
            const uid = req.params.uid
            const identificacion = req.files['identificacion']?.[0] || null;
            const comprobanteDomicilio = req.files['comprobanteDomicilio']?.[0] || null;
            const estadoCuenta = req.files['estadoCuenta']?.[0] || null;
            const {status, message} = await userService.updateUserDocuments(uid,identificacion,comprobanteDomicilio,estadoCuenta);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);   
        }
    }

}