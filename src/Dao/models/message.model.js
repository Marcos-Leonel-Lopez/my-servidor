import mongoose from 'mongoose';

const messageCollection = 'messages' // el nombre de la coleccion

const messageSchema = new mongoose.Schema({
    
})

const messageModel = mongoose.model(messageCollection, messageSchema);
export default messageModel;