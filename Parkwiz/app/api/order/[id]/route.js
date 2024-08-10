import connectDB from "../../../libs/mongodb";
import Order from "../../../models/orderModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = params;
    await connectDB();

    try {
        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ message: "No order found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Order retrieved successfully", order }, { status: 200 });
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = params;

    try {
        const updateData = await req.json();
        await connectDB();
        
        const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Order updated successfully", order }, { status: 200 });
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        await connectDB();
        const result = await Order.findByIdAndDelete(id);
        if (!result) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Order successfully deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting order:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
