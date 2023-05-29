import { Router } from "express";
import userModel from "../Dao/models/user.model.js";
import {createHash, validatePass} from '../utils.js';

const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, mail, age, password } = req.body;

    const exist = await userModel.findOne({ mail });
    if (exist) {
        return res.status(400).send({
            status: 'error',
            error: 'Usuario existente'
        })
    }
    const user = {first_name, last_name, mail, age, password: createHash(password)};
    const result = await userModel.create(user);
    return res.status(200).send({
        status: 'success',
        result
    })
})



router.post('/login', async (req, res) => {
    const {mail, password}=req.body;

    const user = await userModel.findOne({mail});
    if(!user){
        return res.status(400).send({
            status: 'error',
            error: 'Datos incorrectos'
        })
    }

    const isValidPass = validatePass(password, user);
    if(!isValidPass){
        return res.status(401).send({
            status: 'error',
            error: 'Datos incorrectos'
        })
    }



    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        mail: `${user.mail}`,
        age: `${user.age}`,
        role: `${user.role}`
    };
    return res.status(200).send({
        status: 'success',
        payload: req.res.user,
        smg: 'Primer logueo'
    });
});

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({
            status: 'error',
            smg: 'No se pudo cerrar sesion'
        })
        res.redirect('/login')
    })
})



export default router;