import { NextRequest, NextResponse } from "next/server";
import runQuery from "@/utils/database_manager.js"
import OracleDB from "oracledb";

export async function GET(request) {
    let tag_ids
    tag_ids = request.nextUrl.searchParams.get('tags') ? request.nextUrl.searchParams.get('tags').split(',') : ['0']
    let catagory_ids
    catagory_ids = request.nextUrl.searchParams.get('catagories') ? request.nextUrl.searchParams.get('catagories').split(',') : ['0']
    tag_ids = tag_ids.map(tag_id => parseInt(tag_id))
    catagory_ids = catagory_ids.map(catagory_id => parseInt(catagory_id))
    try {
        const query = `
        BEGIN
        get_recipe_by_tags(:tag_ids_csv,:category_ids_csv, :recipes_cursor, :status);
        END;`;
        const binds = {
            tag_ids_csv: { dir: OracleDB.BIND_IN, type: OracleDB.STRING, val: tag_ids.join(',') },
            category_ids_csv: { dir: OracleDB.BIND_IN, type: OracleDB.STRING, val: catagory_ids.join(',') },
            recipes_cursor: { dir: OracleDB.BIND_OUT, type: OracleDB.CURSOR },
            status: { dir: OracleDB.BIND_OUT, type: OracleDB.STRING, maxSize: 40 },
        }
        const result = await runQuery(query, false, binds);
        if (result.outBinds.status !== "SUCCESSFUL") {
            throw new Error(result.outBinds.status);
        }
        const recipeSet = result.outBinds.recipes_cursor;
        let recipe;
        let recipes = [];
        while ((recipe = await recipeSet.getRow())) {
            recipes.push(recipe);
        }
        recipeSet.close();
        return NextResponse.json({ data: recipes });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: err.message, succss: false }, { status: 200 });
    }
}