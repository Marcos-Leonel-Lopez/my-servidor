import { Router } from "express";
import passport from "passport";
import SessionController from "../controllers/session.controller.js";

const sessionController = new SessionController();
const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), sessionController.register)

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), sessionController.login);

router.get('/github', passport.authenticate('github',{scope:['user:email']}), async (req,res)=>{});

router.get('/githubcallback', passport.authenticate('github',{ failureRedirect: '/faillogin' }), sessionController.githubcallback)

router.get('/logout', sessionController.logout);

router.post('/restartPassword', sessionController.restartPassword)

router.get('/failregister', sessionController.failregister);

router.get('/faillogin', sessionController.faillogin);



export default router;