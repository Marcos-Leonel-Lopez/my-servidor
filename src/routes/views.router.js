import { Router } from "express";
import AccessManager from "../Dao/managers/AccessManager.js";

const accessManager = new AccessManager();

const router = Router();

router.get('/', async (req,res)=>{
    await accessManager.createRecords('GET de view')
    res.send({msg:'GET'})
})

router.post('/', async (req,res)=>{
    await accessManager.createRecords('POST de view')
    res.send({msg:'POST'})
})

export default router;