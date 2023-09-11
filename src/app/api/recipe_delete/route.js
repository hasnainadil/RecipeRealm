import { NextResponse } from "next/server";
import runQuery from "@/utils/database_manager";

export async function POST(request) {
    const reqBody = await request.json()
    const { recipe_id } = reqBody
    const query = `DELETE FROM recipes WHERE recipe_id = ${recipe_id}`
    try{
    const result = await runQuery(query, true, {})
    return NextResponse.json({ success: true, message: "doing fine" }, { status: 200 })
    }catch(err){
        console.log(err)
        return NextResponse.json({ success: false, message: "something went wrong" }, { status: 500 })
    }
}