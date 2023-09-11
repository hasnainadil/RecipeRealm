import { NextRequest, NextResponse } from "next/server";
import runQuery from "@/utils/database_manager";

export async function GET(request) {
    const id = request.nextUrl.searchParams.get("id");
    const query = `
    BEGIN
    GetMealPlanDetails(:ID, :CURSOR);
    END;
    `;
    const binds = {
        ID: { dir: oracledb.BIND_IN, val: id, type: oracledb.NUMBER },
        CURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
    }
    try{
        const result = await runQuery(query, true, binds);
        const mealplanSet = result.outBinds.CURSOR;
        let mealplan = [];
        let row;
        while ((row = await mealplanSet.getRow())) {
            mealplan.push(row);
        }
        await mealplanSet.close();
        return NextResponse.json({ data: mealplan }, { status: 200 });
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Something went wrong", success: false }, { status: 200 })
    }
}