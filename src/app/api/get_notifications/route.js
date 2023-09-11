import { NextRequest, NextResponse } from "next/server";
import runQuery from "@/utils/database_manager";
import jwt from "jsonwebtoken";

export async function GET(request) {
    const token = request.cookies.get("current_user")?.value || "";
    if (!token) {
        return NextResponse.json({ message: "No token", succss: false }, { status: 200 });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const id = decoded.id;
    try {
        const query = `SELECT * FROM NOTIFICATIONS WHERE USER_ID = ${id} ORDER BY CREATED_AT DESC`;
        const result = await runQuery(query, false);
        return NextResponse.json({ message: "success", success: true, notifications: result.rows }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: error.message, success: false }, { status: 200 });
    }
}