import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { productCollection, userCollection } from '../../constants/index.js';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
     thumbnail: {
         type: String,
     },
     status: {
         type: Boolean,
         default: true,
     },
     code: {
         type: String,
         required: true,
         unique: true
     },
     stock: {
         type: Number,
         required: true
     },
     category: {
         type: String,
         required: true
     },
     owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:userCollection
     },
     thumbnail_docs:{
        type:[
            {
                name:{
                    type: String,
                    required: true
                },
                reference:{
                    type: String,
                    required: true
                }
            }
        ],
        default:[]
    }
})
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);
export default productModel;