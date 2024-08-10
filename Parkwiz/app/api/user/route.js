import connectDB from "../../libs/mongodb";
import User from "../../models/userModel";
import { NextResponse } from "next/server";

export async function GET(){
    connectDB();
    const users=await User.find();
    return NextResponse.json({message:"successfuly get all user",users},{status:200})
}
