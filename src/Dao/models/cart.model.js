import mongoose from 'mongoose';

const cartCollection = 'carts' // el nombre de la coleccion

const cartSchema = new mongoose.Schema({
    products:{
        type: [
            {
                productId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                 quantity: Number
            }
        ],
        default: []
    }
})

const cartModel = mongoose.model(cartCollection, cartSchema);
export default cartModel;