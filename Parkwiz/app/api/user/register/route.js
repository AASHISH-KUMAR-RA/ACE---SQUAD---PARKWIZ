import connectDB from "../../../libs/mongodb";
import User from "../../../models/userModel";
import sendToken from "../../../utils/token";
import { NextResponse } from "next/server";


export async function POST(req){
    try {
        const{name, email, password,phoneNo,avatar}=await req.json();
        await connectDB()
        const user=await User.create({
            name,
            email,
            password,
            phoneNo,
            avatar
        })
       return sendToken(user,201)
       
        
    } catch (error) {
        console.error("Error creating land:", error);
        // Return error response

        return NextResponse.json({ message: "Error creating land", error }, { status: 500 });
        
    }
}