import { NextResponse } from "next/server";
import oracledb from "oracledb";

import runQuery from "@/utils/database_manager";

export async function GET(request) {
    try {
        const query = `
            BEGIN
            ALL_TAGS(:STATUS,:TAGS_CR);
            END;`;
        const binds = {
            STATUS: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 },
            TAGS_CR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        }
        const result = await runQuery(query, false, binds);
        if (result.outBinds.STATUS !== "SUCCESSFUL") {
            throw new Error(result.outBinds.STATUS);
        }
        const tagSet = result.outBinds.TAGS_CR;
        let tag;
        let tags = [];
        while ((tag = await tagSet.getRow())) {
            tags.push(tag);
        }
        tagSet.close();
        return NextResponse.json({ data: tags, success: true });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: err.message, succss: false }, { status: 200 });
    }
}