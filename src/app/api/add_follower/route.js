import { NextRequest, NextResponse } from "next/server";
import runQuery from "@/utils/database_manager";

export async function POST(request) {
    const data = await request.json();
    const { user_id, following_id } = data;
    console.log(user_id, following_id)
    const query = `INSERT INTO FOLLOW (USER_ID,FOLLOWING_ID) VALUES (${user_id},${following_id})`
    try{
        await runQuery(query, true, {})
        return NextResponse.json({ success: true })
    }
    catch(err){
        return NextResponse.json({ success: false ,message:err})
    }
}