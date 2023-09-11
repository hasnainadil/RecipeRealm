import { NextResponse, NextRequest } from "next/server";
import runQuery from "@/utils/database_manager";

export async function GET(request) {
    try {
        const query = `SELECT * FROM CATEGORIES order by NAME ASC`;
        const result = await runQuery(query);
        return NextResponse.json({data: result.rows, success: true},{status:200});
    }
    catch (e) {
        console.log(e);
        return NextResponse.json({message: e.message, success: false}, {status: 200});
    }
}