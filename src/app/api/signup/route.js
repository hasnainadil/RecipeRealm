import { NextRequest, NextResponse } from "next/server";
import runQuery from "@/utils/database_manager.js"
import OracleDB from "oracledb";

export async function POST(request) {
    try {
        const reqBody = await request.json();
        let { first_name, last_name, emailAddress, PASSWORD } = reqBody;
        console.log(first_name, last_name, emailAddress, PASSWORD);
        const query = `
    BEGIN
    SIGNUP(:first_name,:last_name,:email,:password,:status);
    END;`;
        const binds = {
            first_name: { dir: OracleDB.BIND_IN, type: OracleDB.STRING, val: first_name },
            last_name: { dir: OracleDB.BIND_IN, type: OracleDB.STRING, val: last_name },
            email: { dir: OracleDB.BIND_IN, type: OracleDB.STRING, val: emailAddress },
            password: { dir: OracleDB.BIND_IN, type: OracleDB.STRING, val: PASSWORD },
            status: { dir: OracleDB.BIND_OUT, type: OracleDB.STRING }
        };
        const result = await runQuery(query, true, binds);
        if (result.outBinds.status == 'SUCCESSFUL') {
            return NextResponse.json({
                message: "Signup successful",
                success: true,
            })
        }
        else {
            throw new Error(result.outBinds.status.toString());
        }
    } catch (error) {
        return NextResponse.json({ 
            success: false,
            message: error.message
         }, { status: 200 })
    }
}