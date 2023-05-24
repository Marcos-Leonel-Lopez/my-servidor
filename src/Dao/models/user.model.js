import mongoose from 'mongoose';
const userCollection = 'users' // el nombre de la coleccion

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
     password: {
         type: String,
         required: true
    },
    role: {
        type: String,
        default: 'client'
    }
})

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;