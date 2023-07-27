import mongoose from 'mongoose';
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
})

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;