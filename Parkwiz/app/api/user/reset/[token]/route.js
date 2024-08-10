import connectDB from "../../../../libs/mongodb";
import User from "../../../../models/userModel";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const POST = async (req, { params }) => {
    try {
        await connectDB();

        const { token } = params;
        const { password, confirmPassword } = await req.json();

        console.log(`Received reset token: ${token}`);
        
        if (!password || !confirmPassword) {
            return NextResponse.json({ message: "Passwords are required" }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
        }

        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        console.log(`Hashed reset token: ${resetPasswordToken}`);

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ message: "Password reset token is invalid or expired" }, { status: 400 });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
};
