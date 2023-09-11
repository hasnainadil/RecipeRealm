import { NextResponse } from "next/server";
import oracledb from "oracledb";
import runQuery from "@/utils/database_manager";

export async function GET(request) {
    try {
        let rownum = request.nextUrl.searchParams.get("rownum")
        let search = request.nextUrl.searchParams.get("search")
        if (!search) {
            search = ''
        }
        if (!rownum) {
            rownum = 0;
        }
        rownum = Number(rownum);
        const query = `
            BEGIN
            ALL_RECIPE(:RECIPE_NUM,:SEARCH,:TOTAL_COUNT,:STATUS,:RECIPES_CR);
            END;`;
        const binds = {
            RECIPE_NUM: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: rownum },
            SEARCH: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: search },
            TOTAL_COUNT: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            STATUS: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 },
            RECIPES_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
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