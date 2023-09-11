import { NextResponse,NextRequest } from "next/server";
import runQuery from "@/utils/database_manager.js";

export async function GET(request)
{
    const query = `SELECT * FROM INGREDIENTS`;
    try{
    const result = await runQuery(query);
    return NextResponse.json({data:result.rows,success:true});
    }
    catch(e){
        return NextResponse.json({message:e.message,success:false})
    }
}