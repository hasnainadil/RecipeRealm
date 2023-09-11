import { NextResponse, NextRequest } from "next/server";
import runQuery from "@/utils/database_manager";

export async function GET(request) {
    try {
        const query = `SELECT * FROM INGREDIENTS WHERE INGREDIENT_ID = ${request.nextUrl.searchParams.get("id")}`
        const result = await runQuery(query)
        const substitute_query = `
        SELECT (SELECT INGREDIENT_ID from INGREDIENTS where INGREDIENT_ID = s.SUBSTITUTE_INGREDIENT_ID) as SUBSTITUTE_INGREDIENT_ID,(SELECT name from INGREDIENTS WHERE INGREDIENT_ID = s.SUBSTITUTE_INGREDIENT_ID) as SUBSTITUTE_NAME
        from INGREDIENTS i join SUBSTITUTIONS s
        ON INGREDIENT_ID = ORIGINAL_INGREDIENT_ID
        WHERE INGREDIENT_ID = ${request.nextUrl.searchParams.get("id")}`
        const substitute_result = await runQuery(substitute_query)
        return NextResponse.json({ data: result.rows[0],substitute:substitute_result.rows, success: true }, { status: 200 })
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}