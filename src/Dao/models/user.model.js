import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { userCollection, cartCollection } from '../../constants/index.js';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    mail: {
        type: String,
        unique: true
    },
    age: {
        type: Number
    },
     password: {
         type: String
    },
    role: {
        type: String,
        enum:['client','premium','admin'],
        default: 'client'
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: cartCollection
    },
    documents:{
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
    },
    last_connection:{
        login:{
            type: String,
            default: null
        },
        logout:{
            type: String,
            default: null
        }
    },
    status:{
        type: String,
        enums:["completo","incompleto","pendiente"],
        default: "pendiente"
    },
    avatar:{
        type: String,
        default:""
    }
})
userSchema.plugin(mongoosePaginate);
const userModel = mongoose.model(userCollection, userSchema);
export default userModel;