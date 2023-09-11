import { NextRequest, NextResponse } from "next/server";
import oracledb from "oracledb";
import runQuery from "@/utils/database_manager";

export async function GET(request) {
    let search_type = request.nextUrl.searchParams.get("search_type")
    let search_query = request.nextUrl.searchParams.get("search_query")
    let row_num = request.nextUrl.searchParams.get("row_num")
    if (!row_num) {
        row_num = 0;
    }
    else {
        row_num = Number(row_num);
    }
    let recipes = [];
    let profiles = [];
    try {
        if (search_type === "recipes" || search_type === "all") {
            const query = `
            BEGIN
            ALL_RECIPE(:RECIPE_NUM,:SEARCH,:TOTAL_COUNT,:STATUS,:RECIPES_CR);
            END;`;
            const binds = {
                RECIPE_NUM: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: row_num },
                SEARCH: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: search_query },
                TOTAL_COUNT: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                STATUS: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 },
                RECIPES_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            }
            const result = await runQuery(query, false, binds);
            if (result.outBinds.STATUS !== "SUCCESSFUL") {
                throw new Error(result.outBinds.STATUS);
            }
            const recipeSet = result.outBinds.RECIPES_CR;
            let recipe;
            while ((recipe = await recipeSet.getRow())) {
                recipes.push(recipe);
            }
            recipeSet.close();
        }
        if (search_type === "profiles" || search_type === "all") {
            const query = `
            BEGIN
            ALL_PROFILE(:PROFILE_NUM,:SEARCH,:TOTAL_COUNT,:STATUS,:PROFILES_CR);
            END;`;
            const binds = {
                PROFILE_NUM: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: row_num },
                SEARCH: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: search_query },
                TOTAL_COUNT: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                STATUS: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 },
                PROFILES_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            }
            const result = await runQuery(query, false, binds);
            if (result.outBinds.STATUS !== "SUCCESSFUL") {
                throw new Error(result.outBinds.STATUS);
            }
            const profileSet = result.outBinds.PROFILES_CR;
            let profile;
            while ((profile = await profileSet.getRow())) {
                profiles.push(profile);
            }
            profileSet.close();
        }
        return NextResponse.json({ recipes: recipes, profiles: profiles, success: true }, { status: 200 });
    }
    catch (err) {
        console.log(err)
        return NextResponse.json({ message: err.message, succss: false }, { status: 200 });
    }
}