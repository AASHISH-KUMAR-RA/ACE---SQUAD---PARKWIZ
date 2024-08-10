// login.js

import connectDB from "../../../libs/mongodb";
import User from "../../../models/userModel";
import sendToken from "../../../utils/token";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ message: "Please enter email and password" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return NextResponse.json({ message: "Invalid email" }, { status: 401 });
    }

    const isPasswordValid = await user.isValidPassword(password);

    if (!isPasswordValid) {
        return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    return sendToken(user, 201);
}
