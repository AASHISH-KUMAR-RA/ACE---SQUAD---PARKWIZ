import connectDB from "../../../libs/mongodb";
import Order from "../../../models/orderModel";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../middleware/auth";

export async function POST(req) {
    try {
        // Verify the token and get the user
        const user = await verifyToken(req);

        const {
            slotNos,
            itemsPrice
        } = await req.json();

        await connectDB(); // Ensure the database connection is awaited

        const quantity = slotNos.length; // Calculate the quantity
        const totalPrice = quantity * itemsPrice; // Calculate total price

        const order = await Order.create({
            user: user._id, // Set the user ID from the token
            name: user.name,
            slotNos,
            quantity,
            itemsPrice,
            totalPrice
        });

        return NextResponse.json(
            { success: true, message: "Order created successfully", order },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { success: false, message: "Error creating order", error: error.message },
            { status: 500 }
        );
    }
}
