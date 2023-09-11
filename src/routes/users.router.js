import {Router} from "express";
import UserController from "../controllers/user.controller.js"
import { checkAuthenticated, onlyAdmin } from "../middlewares/auth.js";
import { uploaderdocument } from "../middlewares/handleFiles.js";

const userController = new UserController();
const router = Router();

router.get('/',userController.getUsers)
router.get('/:uid',userController.getUser)
//router.put('/premium/:uid',checkAuthenticated,userController.changeRole)
router.put('/premium/:uid',userController.changeRole)
router.put('/:uid/documents', checkAuthenticated,uploaderdocument.fields([{name:'identificacion',maxCount:1},{name:'comprobanteDomicilio', maxCount:1},{name:'estadoCuenta', maxCount:1}]),userController.updateUserDocuments)
router.delete('/delete', onlyAdmin,userController.deleteUserTime)
router.delete('/delete/:uid',onlyAdmin,userController.deleteUser)

export default router;