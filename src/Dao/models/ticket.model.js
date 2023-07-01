import mongoose from 'mongoose';
import { ticketCollection, userCollection } from '../../constants/index.js';

const ticketSchema = new mongoose.Schema({
    code: String,
    purchase_datatime: Number,
    amount: Number,
    purchaser: {
        type: String
    },
    status:{
        type: String,
        enum:['pending', 'completed', 'canceled'],
        default:'pending',
    }
})

const ticketModel = mongoose.model(ticketCollection, ticketSchema);
export default ticketModel;