import { NextRequest, NextResponse } from "next/server";
import runQuery from "@/utils/database_manager";

export async function POST(request) {
    const data = await request.json();
    const { user_id, following_id } = data;
    console.log(user_id, following_id)
    const query = `delete FROM FOLLOW WHERE USER_ID = ${user_id} and FOLLOWING_ID = ${following_id}`
    try {
        await runQuery(query, true, {})
        return NextResponse.json({ success: true })
    }
    catch (err) {
        return NextResponse.json({ success: false, message: err })
    }
}