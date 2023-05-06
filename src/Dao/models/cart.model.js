import mongoose from 'mongoose';

const cartCollection = 'carts' // el nombre de la coleccion

const cartSchema = new mongoose.Schema({
    
})

const cartModel = mongoose.model(cartCollection, cartSchema);
export default cartModel;