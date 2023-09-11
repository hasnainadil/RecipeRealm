import { NextResponse, NextRequest } from "next/server";
import runQuery from "@/utils/database_manager";
import oracledb from "oracledb";
import jwt from "jsonwebtoken";

export async function GET(request) {
    const token = request.cookies.get("current_user")?.value || "";
    if (!token) {
        return NextResponse.json({ message: "No token", succss: false }, { status: 200 });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const id = decoded.id
    try {
        const query = `
            BEGIN 
            DIETRY_RECIPES(:ID,:ROW_LIMIT,:STATUS,:RECIPES_CR);
            END;
            `;
        const binds = {
            ID: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: id },
            ROW_LIMIT: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: 0 },
            STATUS: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
            RECIPES_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        }
        const result = await runQuery(query, true, binds);
        const recipeset = result.outBinds.RECIPES_CR;
        let recipe;
        let recipes = [];
        while ((recipe = await recipeset.getRow())) {
            recipes.push(recipe);
        }
        recipeset.close()
        return NextResponse.json({id:id, data: recipes, succss: true })
    }
    catch (error) {
        return NextResponse.json({ succss: false, message: error.message })
    }
}