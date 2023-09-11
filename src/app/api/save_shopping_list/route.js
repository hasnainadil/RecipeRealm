import { NextResponse, NextRequest } from "next/server";
import runQuery from "@/utils/database_manager";
import oracledb from "oracledb";

export async function POST(request) {
    const reqBody = await request.json();
    const { list_item } = reqBody;
    try{
    const token = request.cookies.get('current_user')?.value || ''
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const user_id = decoded.id;
    NextResponse.json({ message: 'success', success: true }, { status: 200 })
    }catch(error){
        return NextResponse.json({ error: error.message }, { status: 200 })
    }
}