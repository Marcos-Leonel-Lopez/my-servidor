import userModel from "../Dao/models/user.model.js";

export default class SessionDao{
    getUser = async (email) =>{
        return await userModel.findOne({ email });
    }
    updatePassword = async (user, newHashedPass) =>{
        return await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPass } });
    }
}