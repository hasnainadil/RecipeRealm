import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import oracledb from 'oracledb';
import runQuery from '@/utils/database_manager';
export async function POST(request) {
    try {
        const reqBody = await request.json()
        let { email, password } = reqBody;
        console.log(email, password)
        const query = `
        BEGIN
        LOGIN(:email,:password,:status,:id,:first_name,:last_name,:email_address,:reg_date,:profile_pic);
        END;`;
        const binds = {
            email: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: email },
            password: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: password },
            status: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
            id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            first_name: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
            last_name: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
            email_address: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
            reg_date: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
            profile_pic: { dir: oracledb.BIND_OUT, type: oracledb.STRING }            
        };
        const result = await runQuery(query, false, binds);
        if (result.outBinds.status != 'SUCCESSFUL') {
            throw new Error(result.outBinds.status.toString());
        }
        console.log(result.outBinds)
        const tokenData = result.outBinds;
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "7d" })
        const response = NextResponse.json({
            message: "Login successful",
            userID: result.outBinds.id,
            success: true,
        })
        response.cookies.set(process.env.TOKEN_NAME, token, {
            httpOnly: true,
        })
        return response;

    } catch (error) {
        return NextResponse.json({
            message: error.message,
            success: false
        }, { status: 200 })
    }
}



