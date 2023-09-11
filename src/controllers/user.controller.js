import { userService } from "../repository/index.repository.js"
import { UserDto } from "../Dao/dto/user.dto.js";

export default class UserController {
    getUsers = async (req, res) => {
        try {
            const { status, message } = await userService.getUsers();
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    };
    getUser = async (req, res) => {
        try {
            const uid = req.params.uid;
            const { status, message } = await userService.getUser(uid);
            return res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    }
    deleteUser = async (req, res) => {
        try {
            const { status, message } = await userService.deleteUser();
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    }
    changeRole = async (req, res) => {
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
    updateUserDocuments = async (req, res) => {
        try {
            const uid = req.params.uid
            const identificacion = req.files['identificacion']?.[0] || null;
            const comprobanteDomicilio = req.files['comprobanteDomicilio']?.[0] || null;
            const estadoCuenta = req.files['estadoCuenta']?.[0] || null;
            const { status, message } = await userService.updateUserDocuments(uid, identificacion, comprobanteDomicilio, estadoCuenta);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    }
    panelAdmin = async (req, res) => {
        const { limit = 10, page = 1, role = 'all' } = req.query;
        const { status, message } = await userService.panelAdmin(limit, page, role);
        if (status === 200) {
            const { payload, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink } = message;
            const users =  payload.map(item => item.toObject())
            return res.render('panelAdmin',{users,hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink, totalPages, limit, page, role, title: 'Panel de usuarios', style: 'style.css', error: false})
        }else{
            return res.render('panelAdmin', { title: 'Panel de usuarios', style: 'style.css', error: true })
        }
        
 








    }
}