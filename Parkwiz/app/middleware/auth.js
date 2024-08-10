import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import connectDB from "../libs/mongodb";

export async function verifyToken(req) {
    const tokenObj = req.cookies.get('token');

    if (!tokenObj) {
        throw new Error('Authentication token is missing');
    }

    const token = tokenObj.value;

    try {
        if (typeof token !== 'string' || token.trim() === '') {
            throw new Error('Invalid token');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await connectDB();
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        console.log("Error during token verification:", error.message);
    }
}
