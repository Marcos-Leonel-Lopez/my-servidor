import userModel from "../Dao/models/user.model.js";
import { sessionService } from "../repository/index.repository.js";
import { date } from "../utils.js"



export default class SessionController{
    register = async (req, res) => {
        req.logger.info(req.user)
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
            payload: req.session.user,
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

    logout = async (req, res) => {
        try {
            const user = await userModel.findById(req.user._id)
            user.last_connection.logout = await date()
            await user.save();
            req.session.destroy(err => {
                if (err) return res.status(500).send({
                    status: 'error',
                    message: 'No se pudo cerrar sesion'
                })
                req.logger.info('cerro sesion')
                res.redirect('/login')
            })
        } catch (error) {
            res.status(500).send({
                status: 'error',
                error: 'no hay sesion activa'
            });
        }
        
    };

    failregister = async (req, res) => {
        req.logger.error('fallo registro');
        return res.status(400).send({
            status: 'error',
            message: 'fallo el registro'
        })
    
    }
    faillogin = async (req, res) => {
        req.logger.error('fallo ingreso');
        return res.status(400).send({
            status: 'error',
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