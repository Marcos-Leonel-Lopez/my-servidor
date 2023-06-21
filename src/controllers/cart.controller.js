import CartService from "../services/cart.service.js";

const cartService = new CartService();

export default class CartController {
    getCarts = async (req, res) => {
        const result = await cartService.getCarts();
        const { status, smg } = result;
        return res.status(status).send(smg);
    }
    getCartById = async (req, res) => {
        const cid = req.params.cid;
        const result = await cartService.getCartById(cid)
        const { status, smg } = result;
        const theCart = smg.cart.products.map(item => item.toObject());
        return res.render('cart', { cid, theCart, title: 'Carrito', style: 'style.css' })
    }
    addCart = async (req, res) => {
        const result = await cartService.addCart();
        const { status, smg } = result;
        return res.status(status).send(smg);
    }
    addProductToCart = async (req, res) => {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const result = await cartService.addProductToCart(cid, pid);
            const { status, smg } = result;
            return res.status(status).send(smg);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    updateProductQuantity = async (req, res) =>{
        try{
            const cid = req.params.cid;
            const pid = req.params.pid;
            const { quantity } = req.body;
            const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
            const { status, smg } = updatedCart;
            return res.status(status).send(smg);
        }catch (error) {
            return res.status(500).send(error.message);
          }
    }

    deleteProductOnCart = async (req, res) => {
        try {
          const cid = req.params.cid;
          const pid = req.params.pid;
          const newCart = await cartService.deleteProductOnCart(cid, pid);
          const { status, smg } = newCart;
          return res.status(status).send(smg);
        } catch (error) {
          return res.status(500).send(error.message);
        }
    }

    deleteAllProductsFromCart = async (req, res) =>{
        try{
            const cid = req.params.cid;
            const updatedCart = await cartService.deleteAllProductsFromCart(cid);
            const { status, smg } = updatedCart;
            return res.status(status).send(smg);
        }catch (error) {
          return res.status(500).send(error.message);
        }
    }
    
}