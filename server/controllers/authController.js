import { json, text } from "express"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE } from "../config/emailTemplates.js";

export const register = async (req, res) => {
     try{

        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }

        const existingUser = await userModel.findOne({email: email});

        if(existingUser){
            return res.json({
                success:false,
                message: "User is already registered"
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await new userModel({name, email, password: hashedPassword});
        
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV ==='production' ? 'none' : 'strict',
            maxAge: 24*60*60*1000,
        })

        const mailOptions = {
            from: 'vikas',
            to: email,
            subject: "Welcome to me! ",
            text: `you have been registered with email ${email}`
        }

        try{
            await transporter.sendMail(mailOptions);
        } catch(error){
            console.log(error.message)
           return res.json({
            success:false,
            message:"error in send email",
            error:error.message,
           })
        }


        return res.json({
            success:true,
            message:" User has been registered successfully"
        })

     }
     catch(error){
        console.log(error.message);
        return res.json({
            success:false,
            message:"Error in register:"
        })
     }
}

export const login = async (req, res) => {
    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }

        const  user = await userModel.findOne({email});

        if(!user){
            return res.json({
                success:false,
                message:"User is not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({
                success:false,
                message:"Password is incorrect"
            })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV ==='production' ? 'none' : 'strict',
            maxAge: 24*60*60*1000,
        })

        // const mailOptions = {
        //     from: 'vikas',
        //     to:email,
        //     subject: "Welcome to me! ",
        //     text: `you have been registered with email ${email}`
        // }

        // try{
        //     await transporter.sendMail(mailOptions);
        // } catch(error){
        //    return res.json({
        //     success:false,
        //     message:"error in send email",
        //     error:error.message,
        //    })
        // }

        return res.json({
            success:true,
            message:"User is loged in successfully"
        })


    } catch(error){
       return res.json({
        success:false,
        message:"Error in login"
       })
    }
}


export const logout = async (req, res) => {
    try{

        // const token = req.cookies.token;

        // if(!token){
        //     return res.json({
        //         success:false,
        //         message:"token is not provided"
        //     })
        // }

        // const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // const userId = decoded.id;

        // await userModel.findByIdAndDelete(userId);/


        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV ==='production' ? 'none' : 'strict',
        })


        return res.json({
            success:true,
            message:" loged out successfully "
        })

    } catch(error){

        return res.json({
            success:false,
            message:"error in logout"
        })

    }
}

export const sendVerifyOtp = async (req, res) => {
    try{
       
       const {userId} = req.body;

       const user = await userModel.findById(userId);

    // const {email} = req.body;

    // const user = await userModel.findOne({email});

       if(user.isAccountVerified){
        return res.json({
            success:false,
            message:"Account is already verified"
        })
       }

       const otp = String(Math.floor(Math.random()*900000 + 100000));

       user.verifyOtp = otp;
       user.verifyOtpExpireAt = Date.now() + 24*60*60*1000;

       user.save();

       const mailOptions = {
           from: 'vikas kumar',
           to: user.email,
           subject: "Account verification OTP",
        //    text: `Your OTP is ${otp}.\n Verify your account using this otp`
           html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp)
       }

       try{
          await transporter.sendMail(mailOptions);
       } 
       catch(error){
        return res.json({
            success:false,
            message:"error in sending otp",
            error:error.message
        })
       }

       return res.json({
        success:true,
        message:"OTP has been sent"
       })

    } catch(error){
        return res.json({
            success:false,
            message:"error in sending otp"
        })
    }
}

export const verifyEmail = async (req, res) =>{
    try{

        const {userId, otp} = req.body;

        const user = await userModel.findById(userId);

        if(!user){
            return res.json({
                success:false,
                message:"User is not registered"
            })
        }

        if(user.verifyOtp==='' || user.verifyOtp!==otp){
            return res.json({
                success:false,
                message:"Invalid opt"
            })
        }

        if(otp.verifyOtpExpireAt < Date.now()){
            return res.json({
                success:false,
                message:"OTP is expired"
            })
        }

        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;

        await user.save();

        return res.json({
            success:true,
            message:"OTP verified successfully"
        })

    } catch(error){

    }
}


export const isAuthenticated = async (req, res) =>{
    try{

        return res.json({
            success:true,
            message:"Authentication success"
        })
        
    } catch(error){
        return res.json({
            success:false,
            message:"authentication issue"
        })
    }
}

export const sendResetOtp = async (req, res) =>{
    try{

        const {email} = req.body;

        if(!email){
            return res.json({
                success:false,
                message:"Email is required"
            })
        }

        const user = await userModel.findOne({email});
        
        if(!user){
            return res.json({
                success:false,
                message:"user is not found"
            })
        }
        
        const otp = String(Math.floor(Math.random()*900000 + 100000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15*60*1000;
 
        user.save();
 
        const mailOptions = {
            from: 'vikas kumar',
            to: user.email,
            subject: "Password reset OTP",
            // text: `Your password reset OTP is ${otp}.\n Reset you password using this otp`
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp)
        }

        try{
            await transporter.sendMail(mailOptions);
        }
        catch(error){
            return res.json({
                success:false,
                message:"Error in message"
            })
        }

        return res.json({
            success:true,
            message:"Reset OTP sent to your email"
        })


    } catch(error){
         return res.json({
            success:false,
            message: "Error in sending reset otp",
            error:error.message
         })
    }
}


export const resetPassword = async (req, res) => {
    try{

        const {newPassword, email, otp} = req.body;

        if(!email || !otp || !newPassword){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({
                success:false,
                message:"User is not found"
            })
        }

        if(user.resetOtp=== "" || user.resetOtp!==otp){
            return res.json({
                success:false,
                message:"Invalid otp",
            })
        }
        
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({
                success:false,
                message:"OTP expired"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp='';
        user.resetOtpExpireAt=0;

        await user.save();

        return res.json({
            success:true,
            message:"Password has been reset"
        })

    }
    catch(error){
       return res.json({
        success:false,
        message:"error in reset password",
        error:error.message
       })
    }
}
