import { NextResponse, NextRequest } from "next/server";
import runQuery from "@/utils/database_manager";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const reqbody = await request.json();
        const { recipe_id, comment, rating } = reqbody;
        const token = request.cookies.get("current_user")?.value || "";
        if (!token) {
            return NextResponse.json({ message: "No token", succss: false }, { status: 200 });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user_id = decoded.id;
        const query = `INSERT INTO REVIEWS (REVIEW_ID,USER_ID, RECIPE_ID, RATING ,REVIEW_DATE, COMMENTS) VALUES ((SELECT COUNT(*)+1 FROM REVIEWS),${user_id},${recipe_id},${rating},SYSDATE,'${comment}')`;
        await runQuery(query, true, {});
        return NextResponse.json({ message: "Review added successfully", success: true }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: error.message, success: false }, { status: 200 });
    }
}