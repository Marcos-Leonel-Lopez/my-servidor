import { Router } from "express";
import passport from "passport";
import SessionController from "../controllers/session.controller.js";
import { uploaderProfile } from "../middlewares/handleFiles.js";

const sessionController = new SessionController();
const router = Router();

router.post('/register', uploaderProfile.single("avatar"), passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }), sessionController.register)

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }), sessionController.login);

router.get('/github', passport.authenticate('github',{scope:['user:email']}), async (req,res)=>{});

router.get('/githubcallback', passport.authenticate('github',{ failureRedirect: '/api/sessions/faillogin' }), sessionController.githubcallback)

router.get('/logout', sessionController.logout);

router.post('/resetPassword', sessionController.restartPassword)

router.post('/forgotPassword', sessionController.forgotPassword)

router.get('/failregister', sessionController.failregister);

router.get('/faillogin', sessionController.faillogin);



export default router;