import messageModel from "../models/message.model.js";

export default class MessageManager{

    newMessage = async (data) =>{
        await messageModel.create(data) 
        return
    }

    getMessages = async ()=>{
        const data = await messageModel.find();
        if(data.length > 0){
            return data
        }else{
            return data = [];
        }
    }
}