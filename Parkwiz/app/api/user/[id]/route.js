import connectDB from "../../../libs/mongodb";
import User from "../../../models/userModel";
import { NextResponse } from "next/server";

export async function GET(req,{params}){
    try {
        const {id} = params
        await connectDB();
        const user=await User.findById(id)
        return NextResponse.json({success:true,user},{status:200})
    } catch (error) {
        console.error("Error to find user:", error);
        // Return error response

        return NextResponse.json({ message: "Error to find user", error }, { status: 500 });
    }


}
export async function PUT(req,{ params }){
    try {
        const {id} = params
    const{name,email,phoneNo,role,avatar}=await req.json();
    await connectDB();
    const user=await User.findByIdAndUpdate(id,{name,email,phoneNo,role,avatar},{
        new:true,
        runValidators:true,
      })
    return NextResponse.json({success:true,user},{status:200})
    } catch (error) {
        console.error("Error to update user:", error);
        // Return error response

        return NextResponse.json({ message: "Error to update user", error }, { status: 500 });
    }
    

}
export async function DELETE(req,{ params }){
    try {
    const {id} = params
    await connectDB();
    await User.findByIdAndDelete(id)
    return NextResponse.json({success:true,message:"successfully deleted"},{status:200})
    } catch (error) {
        console.error("Error to delete user:", error);
        // Return error response

        return NextResponse.json({ message: "Error to delete user", error }, { status: 500 });
    }
    

}