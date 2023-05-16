import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
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
cartSchema.plugin(mongoosePaginate);
const cartModel = mongoose.model(cartCollection, cartSchema);
export default cartModel;