import connectDB from "../../../libs/mongodb";
import User from "../../../models/userModel";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../middleware/auth";

export async function GET(req) {
    try {
        await connectDB();

        const user = await verifyToken(req);
        const profile = await User.findById(user._id);
        if(!profile){
            return NextResponse.json({ message: "No profile found"}, { status: 400 });
        }

        return NextResponse.json({ message: "get user profile successfull", profile }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
