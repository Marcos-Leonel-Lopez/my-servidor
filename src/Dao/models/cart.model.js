 import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { cartCollection, productCollection } from '../../constants/index.js';


const cartSchema = new mongoose.Schema({
    products:{
        type: [
            {
                productId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: productCollection
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