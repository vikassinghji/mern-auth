import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
   try{
        const {userId} = req.body;

        const user = await userModel.findById(userId);
     
        if(!user){
         return res.json({
             success:false,
             message:"user not found"
         })
        }
     
        return res.json({
         success:true,
         userData:{
             name:user.name,
             isAccountVerified:user.isAccountVerified
         }
        })
   } catch(error){
    return res.json({
        success:false,
        message:"erro in fetching user data",
        error:error.message
    })
   }
}