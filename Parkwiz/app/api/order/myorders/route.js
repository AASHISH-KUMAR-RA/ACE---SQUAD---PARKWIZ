// orders.js

import connectDB from "../../../libs/mongodb";
import Order from "../../../models/orderModel";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../middleware/auth";

export async function GET(req) {
    try {
        await connectDB();

        const user = await verifyToken(req);
        const orders = await Order.find({ user: user._id });

        if (!orders.length) {
            return NextResponse.json({ message: "Your cart is empty" }, { status: 404 });
        }

        return NextResponse.json({ message: "Orders retrieved successfully", orders }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
