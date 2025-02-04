import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

const userAuth = async (req, res, next) => {
    try{
       const token =req.cookies.token;

       if(!token){
        return res.json({
            success:false,
            message:"token is not present"
        })
       }

       const decode =  jwt.verify(token, process.env.JWT_SECRET);
       
       if(decode.id){
        req.body.userId=decode.id;
       }
       else{
        return res.json({
            success:false,
            message:"token is not containing user id"
        })
       }

       next();

    } catch(error){
       return res.json({
        success:false,
        message:"error in middleware",
        error:error.message
       })
    }
}

export default userAuth