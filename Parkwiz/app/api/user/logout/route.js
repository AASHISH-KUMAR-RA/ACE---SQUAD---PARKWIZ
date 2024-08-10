import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({
        success: true,
        message: "Logged Out"
    }, { status: 200 });

    response.cookies.set('token', '', {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    return response;
}
