import { sessionService } from "../repository/index.repository.js";
import { createHash, validatePass } from "../utils.js"


export default class SessionController{
    register = async (req, res) => {
        return res.status(200).send({
            status: "success",
            message: 'Usuario Registrado'
        })
    }
    login = async (req, res) => {        
        if (!req.user) {
            return res.status(400).send({
                status: 'error',
                message: 'Datos incorrectos'
            })
        }
        req.session.user = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            mail: `${req.user.mail}`,
            age: `${req.user.age}`,
            role: `${req.user.role}`,
            cart: `${req.user.cart}`,
        };
        return res.status(200).send({
            status: 'success',
            payload: req.user,
            message: 'Primer logueo'
        });
    }
    githubcallback = async (req, res)=>{
        req.session.user = {
            name: `${req.user.first_name}`,
            mail: `${req.user.mail}`,
            age: `${req.user.age}`,
            role: `${req.user.role}`,
            cart: `${req.user.cart}`
        };
        req.logger.debug(JSON.stringify(req.session.user));
        res.redirect('/profile')
    }

    logout = (req, res) => {
        req.session.destroy(err => {
            if (err) return res.status(500).send({
                status: 'error',
                message: 'No se pudo cerrar sesion'
            })
            res.redirect('/login')
        })
    };

    failregister = async (req, res) => {
        return res.status(400).send({
            status: error,
            message: 'fallo el registro'
        })
    
    }
    faillogin = async (req, res) => {
        req.logger.error('fallo ingreso');
        return res.status(400).send({
            status: error,
            message: 'fallo el ingreso'
        })
    
    }

    restartPassword = async (req, res) => {
        try {
            const token = req.query.token;
            const { mail, password } = req.body;
            req.logger.info(token);
            const {status, message} = await sessionService.restartPassword(mail, password,token);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);   
        }
    }

    forgotPassword = async (req,res) =>{
        try {
            const {mail} = req.body;
            console.log(mail);
            
            const { status, message } = await sessionService.forgotPassword(mail);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);   
        }
    }

}