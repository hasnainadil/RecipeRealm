import { NextRequest, NextResponse } from "next/server";
import runQuery from "@/utils/database_manager";
import oracledb from "oracledb";
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
            RECOMMENDATION(:ID,:STATUS,:RECIPES_CR);
            END;`;
        const binds = {
            ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: id },
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
        return NextResponse.json({ data: recipes });

    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: error.message, success: false }, { status: 200 });

    }
}