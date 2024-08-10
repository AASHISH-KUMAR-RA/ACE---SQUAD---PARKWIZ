
import connectDB from "../../../../libs/mongodb";
import User from "../../../../models/userModel";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../../middleware/auth";// Import your ErrorHandler

export async function POST(req, { params }) {
  try {
    // Connect to the database
    await connectDB();
    const session= await verifyToken(req);


    const { id } = params; // Extract user ID from the URL params
    const sessionUserId = session._id.toString();

    // Ensure the current session user is trying to change their own password
    if (sessionUserId !== id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Parse the request body
    const { oldPassword, password } = await req.json();

    // Find the user by ID and select the password field
    const user = await User.findById(id).select("password");

    // Check if the old password is correct
    const isOldPasswordValid = await user.isValidPassword(oldPassword);

    if (!isOldPasswordValid) {
        return NextResponse.json(
            { success: false, message: "Old password is incorrect" },
            { status: 400 }
          );
    }

    // Assign new password
    user.password = password;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error changing password:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
}
