import { Router } from "express";
import AccessManager from "../Dao/managers/AccessManager.js";
import productModel from "../Dao/models/product.model.js";
import ValidationManager from "../Dao/managers/ValidationManager.js";

const accessManager = new AccessManager();
const validationManager = new ValidationManager();


const router = Router();

router.get('/products', async (req,res)=>{
    const { limit } = req.query;
    if (limit) {
        if (limit > 0) {
            const productslimit = await productModel.find().limit(limit);
            const products = productslimit.map(item=>item.toObject())
            return res.render('home', { products, title:'Productos', style: 'style.css', error: false })
        }
        await accessManager.createRecords("Get fallido - limit menor a 0");
        return res.render('home', { title:'Productos', style: 'style.css', error: true })
    } else {
        await accessManager.createRecords("Consulta los productos");
        const result = await productModel.find();
        const products = result.map(item=>item.toObject())
        return res.render('home', { products, title:'Productos', style: 'style.css', error: false })
    }



    
})

router.post('/', async (req,res)=>{
    await accessManager.createRecords('POST de view')
    res.send({msg:'POST'})
})

export default router;