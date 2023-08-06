import { cartService } from "../repository/index.repository.js";


export default class CartController {

    getCarts = async (req, res) => {
        try {
            const { status, message } = await cartService.getCarts();
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    };

    getCartById = async (req, res) => {
        try {
            const cid = req.params.cid;
            const { status, message } = await cartService.getCartById(cid);
            const theCart = message.cart.products.map(item => item.toObject());
            res.status(status).send(message)
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    };

    getCartByIdRender = async (req, res) => {
        try {
            const cid = req.params.cid;
            const { status, message } = await cartService.getCartById(cid);
            req.logger.debug(message.cart);
            // console.log(message);
            const theCart = message.cart.products.map(item => item.toObject());
            return res.render('cart', { cid, theCart, title: 'Carrito', style: 'style.css' });
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    };
    addCart = async (req, res) => {
        try {
            const { status, message } = await cartService.addCart();
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    };

    addProductToCart = async (req, res) => {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const { status, message } = await cartService.addProductToCart(cid, pid);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    };

    updateProductQuantity = async (req, res) => {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const { quantity } = req.body;
            const { status, message } = await cartService.updateProductQuantity(cid, pid, quantity);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    };

    deleteProductOnCart = async (req, res) => {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const { status, message } = await cartService.deleteProductOnCart(cid, pid);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    };

    deleteAllProductsFromCart = async (req, res) => {
        try {
            const cid = req.params.cid;
            const { status, message } = await cartService.deleteAllProductsFromCart(cid);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    };

    resolveCart = async (req, res) =>{
        try {
            const cid = req.params.cid
            const resolve = req.body;
            const { status, message } = await cartService.deleteAllProductsFromCart(cid);
            res.status(200).send({message:'resolveCart'});
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    }

    createOrder = async (req, res) =>{
        try {
            const cid = req.params.cid;
            const { status, message } = await cartService.createOrder(cid);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);   
        }
    }

}