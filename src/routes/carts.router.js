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
    console.log(JSON.stringify(smg.cart , null,"\t"));
    return res.status(status).send(smg);
})

router.post('/', async (req, res)=>{
     const result = await cartManager.addCart();
     const {status, smg} = result;
     return res.status(status).send(smg);
})


// router.post('/:cid/product/:pid', async (req, res) => {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const cart = await cartManager.getCartById(cid);
//     if (cart.status !== 200){
//         return res.status(cart.status).send(cart.smg);  
//     }else{
//         const product = await validationManager.getProductById(pid);
//         if(product.status !== 200){
//             return res.status(product.status).send(product.smg);
//         }else{
//             const add = await cartManager.addProductToCart(cid, pid);
//             const {status, smg} = add;
//             return res.status(status).send(smg);
//         }
//     }
// })




// router.post('/:cid/product/:pid', async (req, res) => {
//     try {
//       const cid = req.params.cid;
//       const pid = req.params.pid;
  
//       const cart = await cartManager.getCartById(cid);
//       if (cart.status !== 200) {
//         throw new Error(cart.smg.error);
//       }
  
//       const product = await validationManager.getProductById(pid);
//       if (product.status !== 200) {
//         throw new Error(product.smg.error);
//       }
      
//       const add = await cartManager.addProductToCart(cid, pid);
//       return res.status(add.status).send(add.smg);
//     } catch (error) {
//       return res.status(500).send(error.message);
//     }
//   });

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
  







// router.delete('/:cid/product/:pid', async (req, res) => {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const cart = await cartManager.getCartById(cid);
//     if (cart.status !== 200){
//         return res.status(cart.status).send(cart.smg);  
//     }else{
//         const product = await validationManager.getProductById(pid);
//         if(product.status !== 200){
//             return res.status(product.status).send(product.smg);
//         }else{
//             // producto y carrito existente
//             // porducto dentro del carrito?
//             const newCart = await cartManager.deleteProductOnCart(cid,pid)
//             return res.status(newCart.status).send(newCart.smg);
//         }
//     }
// })

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