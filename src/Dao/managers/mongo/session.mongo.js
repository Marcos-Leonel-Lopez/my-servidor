import userModel from "../../models/user.model.js";

export default class SessionMongo{
    getUser = async (email) =>{
        return await userModel.findOne({ email });
    }
    updatePassword = async (user, newHashedPass) =>{
        return await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPass } });
    }
}