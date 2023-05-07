import { Router } from "express";
import AccessManager from "../Dao/managers/AccessManager.js";
import productModel from "../Dao/models/product.model.js";
import ValidationManager from "../Dao/managers/ValidationManager.js";

const accessManager = new AccessManager();
const validationManager = new ValidationManager();


const router = Router();

router.get('/registerProduct', (req, res) => {
    res.render('registerProduct' , { title:'Registro de productos',style: 'style.css'});
})

router.get('/products', async (req,res)=>{
    const { limit } = req.query;
    const result = await validationManager.getProducts(limit);
    const {status, smg} = result;
    if(status == 200){
        await accessManager.createRecords("Consulta los productos");
        const products = smg.payload.map(item=>item.toObject())
        return res.render('home', { products, title:'Productos', style: 'style.css', error: false })
    }
    await accessManager.createRecords("Get fallido - limit menor a 0");
    return res.render('home', { title:'Productos', style: 'style.css', error: true })
})

router.get('/realtimeproducts', async (req,res)=>{
    return res.render('realTimeProducts', { title:'Productos en tiempo real', style: 'style.css', error: false })
})

router.get('/chat', (req, res)=>{
    res.render('chat',{ title:'Chat', style: 'style.css', error: false })
})

export default router;