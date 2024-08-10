import connectDB from "../../libs/mongodb";
import Order from "../../models/orderModel";

import { NextResponse } from "next/server";

export async function GET(){
    connectDB();
    const orders=await Order.find();
    return NextResponse.json({message:"successfuly get all user",orders},{status:200})
}
