import { Router } from "express";
import CartManager from "../Dao/managers/CartManager.js";
import cartModel from "../Dao/models/cart.model.js";
import ProductController from "../controllers/product.controller.js";

const cartManager = new CartManager();
const productController = new ProductController();

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
    console.log(JSON.stringify(smg.cart , null,"\t"));
    return res.status(status).send(smg);
})

router.post('/', async (req, res)=>{
     const result = await cartManager.addCart();
     const {status, smg} = result;
     return res.status(status).send(smg);
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const result = await cartManager.addProductToCart(cid, pid);
      const { status, smg } = result;
      return res.status(status).send(smg);
    } catch (error) {
      return res.status(500).send(error.message);
    }
});
  

router.put('/:cid/product/:pid', async (req, res) =>{
    try{
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        const { status, smg } = updatedCart;
        return res.status(status).send(smg);
    }catch (error) {
        return res.status(500).send(error.message);
      }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const newCart = await cartManager.deleteProductOnCart(cid, pid);
      const { status, smg } = newCart;
      return res.status(status).send(smg);
    } catch (error) {
      return res.status(500).send(error.message);
    }
});

router.delete('/:cid', async (req, res) =>{
    try{
        const cid = req.params.cid;
        const updatedCart = await cartManager.deleteAllProductsFromCart(cid);
        const { status, smg } = updatedCart;
        return res.status(status).send(smg);
    }catch (error) {
      return res.status(500).send(error.message);
    }
})

export default router