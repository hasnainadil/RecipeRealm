import { NextResponse } from "next/server";
import oracledb from "oracledb";
import runQuery from "@/utils/database_manager";
import jwt from "jsonwebtoken";

export async function GET(request) {
    try {
        const token = request.cookies.get("current_user")?.value || "";
        if (!token) {
            return NextResponse.json({ message: "No token", succss: false }, { status: 200 });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const id = decoded.id;
        const query = `
            BEGIN
            FOLLOWING_RECIPE(:ID,:RECIPES_CR,:STATUS);
            END;`;
        const binds = {
            ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: id },
            RECIPES_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            STATUS: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 },
        }
        const result = await runQuery(query, false, binds);
        if(result.outBinds.STATUS !== "SUCCESSFUL"){
            throw new Error(result.outBinds.STATUS);
        }
        const recipeSet = result.outBinds.RECIPES_CR;
        let recipe;
        let recipes = [];
        while ((recipe = await recipeSet.getRow())) {
            recipes.push(recipe);
        }
        recipeSet.close();
        return NextResponse.json({  totalCount: result.outBinds.TOTAL_COUNT,data: recipes, success: true }, { status: 200 });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: err.message, succss: false }, { status: 200 });
    }

}