import { NextResponse, NextRequest } from "next/server";
import jwt from 'jsonwebtoken'

export async function GET(request) {
    const token = request.cookies.get('current_user')?.value || ''
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            return NextResponse.json({ data: decodedToken,message:'verified' }, { status: 200 })
        }
        catch (err) {
            return NextResponse.json({ data: null, message: err.message}, { status: 200 })
        }
    }
    else {
        return NextResponse.json({ message: "no token" }, { status: 200 })
    }
}