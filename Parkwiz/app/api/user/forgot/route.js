import connectDB from "../../../libs/mongodb";
import User from "../../../models/userModel";
import { NextResponse } from "next/server";
import sendEmail from "../../../utils/email";

export async function POST(req) {
    try {
        await connectDB();

        const { email } = await req.json();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'User not found with this email' }, { status: 404 });
        }

        const resetToken = user.getResetToken();
        await user.save({ validateBeforeSave: false });

        // Create reset url
        const resetUrl = `${process.env.BASE_URL}/api/user/reset/${resetToken}`;

        const message = `Your password reset url is as follows \n\n ${resetUrl} \n\n If you have not requested this email, then ignore it.`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Recovery",
                message,
            });

            return NextResponse.json({ success: true, message: `Email sent to ${user.email}` }, { status: 200 });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordTokenExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return NextResponse.json({ message: "Email could not be sent" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ message: "An error occurred", error }, { status: 500 });
    }
};
