import SessionService from "../services/session.service.js"
import { createHash, validatePass } from "../utils.js"

const sessionService = new SessionService();

export default class SessionController{
    register = async (req, res) => {
        return res.status(200).send({
            status: "success",
            smg: 'Usuario Registrado'
        })
    }
    login = async (req, res) => {        
        if (!req.user) {
            return res.status(400).send({
                status: 'error',
                smg: 'Datos incorrectos'
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
            smg: 'Primer logueo'
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
        console.log(req.session.user);
        res.redirect('/profile')
    }
    logout = (req, res) => {
        req.session.destroy(err => {
            if (err) return res.status(500).send({
                status: 'error',
                smg: 'No se pudo cerrar sesion'
            })
            res.redirect('/login')
        })
    }
    failregister = async (req, res) => {
        return res.status(400).send({
            status: error,
            smg: 'fallo el registro'
        })
    
    }
    faillogin = async (req, res) => {
        console.log('fallo ingreso');
        return res.status(400).send({
            status: error,
            smg: 'fallo el ingreso'
        })
    
    }

    restartPassword = async (req, res) => {
        const { mail, password } = req.body;
        if (!mail || !password) {
            return res.status(400).send({
                stauts: 'error',
                smg: 'datos incorrectos'
            })
        }
        // const user = await userModel.findOne({ mail });
        const user = await sessionService.getUser(mail);
        if (!user) {
            return res.status(400).send({
                stauts: 'error',
                smg: 'datos incorrectos'
            })
        }
        const newHashedPass = createHash(password);
        // await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPass } });
        await sessionService.updatePassword(user, newHashedPass)
        res.status(200).send({
            stauts: 'success',
            smg: 'contraseña actualizado'
        })
    }

}