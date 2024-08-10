// token.js

import { NextResponse } from "next/server";

const sendToken = (user, statusCode) => {
    const token = user.getJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    const response = NextResponse.json({
        success: true,
        user,
        token,
    }, { status: statusCode });

    response.cookies.set('token', token, options);

    return response;
};

export default sendToken;
