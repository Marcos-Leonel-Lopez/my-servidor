import { Router } from "express";
import userModel from "../Dao/models/user.model.js";
import { createHash, validatePass } from '../utils.js';
import passport from "passport";

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    return res.status(200).send({
        status: "success",
        smg: 'Usuario Registrado'
    })
    // const exist = await userModel.findOne({ mail });
    // if (exist) {
    //     return res.status(400).send({
    //         status: 'error',
    //         smg: 'Usuario existente'
    //     })
    // }
    // const user = {first_name, last_name, mail, age, password: createHash(password)};
    // const result = await userModel.create(user);
    // return res.status(200).send({
    //     status: 'success',
    //     result
    // })
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
    
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
        role: `${req.user.role}`
    };
    
    return res.status(200).send({
        status: 'success',
        payload: req.user,
        smg: 'Primer logueo'
    });

    // const {mail, password}=req.body;
    // const user = await userModel.findOne({mail});
    // if(!user){
    //     return res.status(400).send({
    //         status: 'error',
    //         smg: 'Datos incorrectos'
    //     })
    // }
    // const isValidPass = validatePass(password, user);
    // if(!isValidPass){
    //     return res.status(401).send({
    //         status: 'error',
    //         smg: 'Datos incorrectos'
    //     })
    // }
    // req.session.user = {
    //     name: `${user.first_name} ${user.last_name}`,
    //     mail: `${user.mail}`,
    //     age: `${user.age}`,
    //     role: `${user.role}`
    // };
    // return res.status(200).send({
    //     status: 'success',
    //     payload: req.res.user,
    //     smg: 'Primer logueo'
    // });
});

router.get('/github', passport.authenticate('github',{scope:['user:email']}), async (req,res)=>{});

router.get('/githubcallback', passport.authenticate('github',{ failureRedirect: '/faillogin' }), async (req, res)=>{
    req.session.user = {
        name: `${req.user.first_name}`,
        mail: `${req.user.mail}`,
        age: `${req.user.age}`,
        role: `${req.user.role}`
    };
    res.redirect('/profile')
})





router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({
            status: 'error',
            smg: 'No se pudo cerrar sesion'
        })
        res.redirect('/login')
    })
});

router.post('/restartPassword', async (req, res) => {
    const { mail, password } = req.body;
    if (!mail || !password) {
        return res.status(400).send({
            stauts: 'error',
            smg: 'datos incorrectos'
        })
    }
    const user = await userModel.findOne({ mail });
    if (!user) {
        return res.status(400).send({
            stauts: 'error',
            smg: 'datos incorrectos'
        })
    }
    const newHashedPass = createHash(password);
    await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPass } });
    res.status(200).send({
        stauts: 'success',
        smg: 'contraseña actualizado'
    })
})

router.get('/failregister', async (req, res) => {
    console.log('fallo registro');
    return res.status(400).send({
        status: error,
        smg: 'fallo el registro'
    })

});

router.get('/faillogin', async (req, res) => {
    console.log('fallo ingreso');
    return res.status(400).send({
        status: error,
        smg: 'fallo el ingreso'
    })

});



export default router;