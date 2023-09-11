import { NextRequest, NextResponse } from "next/server";
import runQuery from "@/utils/database_manager";

export async function GET(request) {
    const query = `SELECT * FROM MEAL_PLANS`;
    try {
        const result = await runQuery(query, false, {});
        return NextResponse.json({ data: result.rows }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Something went wrong", success: false }, { status: 200 })
    }
}