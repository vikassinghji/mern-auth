import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on("connected", ()=>console.log("Database is connected"));
    mongoose.connection.on("error", ()=>("Database connection error"));
    
    try{

        await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`);

    } catch(error){
        console.log("Error in databse connection")
        console.log(error.message);
    }
}

export default connectDB