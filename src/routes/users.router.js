import {Router} from "express";
import UserController from "../controllers/user.controller.js"

const userController = new UserController();
const router = Router();

router.get('/',userController.getUsers)
router.get('/:uid',userController.getUser)
router.put('/premium/:uid',userController.changeRole)
router.delete('/delete/:uid',userController.deleteUser)

// router.get('/premium/:uid')

export default router;