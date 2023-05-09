import { Router } from "express";
import CartManager from "../Dao/managers/CartManager.js";
import cartModel from "../Dao/models/cart.model.js";
import ValidationManager from "../Dao/managers/ValidationManager.js";

const cartManager = new CartManager();
const validationManager = new ValidationManager();

const router = Router();

router.get('/', async (req, res)=>{
     const result = await cartManager.getCarts();
     const {status, smg} = result;
     return res.status(status).send(smg);
})

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const result = await cartManager.getCartById(cid);
    const {status, smg} = result;
    return res.status(status).send(smg);
})

router.post('/', async (req, res)=>{
     const result = await cartManager.addCart();
     const {status, smg} = result;
     return res.status(status).send(smg);
})


router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await cartManager.getCartById(cid);
    if (cart.status !== 200){
        return res.status(cart.status).send(cart.smg);  
    }else{
        const product = await validationManager.getProductById(pid);
        if(product.status !== 200){
            return res.status(product.status).send(product.smg);
        }else{
            const add = await cartManager.addProductToCart(cid, pid);
            const {status, smg} = add;
            return res.status(status).send(smg);
        }
    }
})

export default router