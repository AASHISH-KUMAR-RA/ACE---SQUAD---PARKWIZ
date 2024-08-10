import mongoose from "mongoose";
const connectDB=()=>{
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("connected successfully")
    } catch (error) {
        console.log(error)
    }
}
export default connectDB;