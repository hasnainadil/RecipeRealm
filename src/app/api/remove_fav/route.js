import { NextResponse, NextRequest } from 'next/server'
import runQuery from '@/utils/database_manager';
import oracledb from 'oracledb';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const reqBody = await request.json()
        const { recipe_id } = reqBody;
        const token = request.cookies.get('current_user')?.value || ''
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user_id = decoded.id;
        const query = `DELETE FROM favourite WHERE user_id = ${user_id} AND recipe_id = ${recipe_id}`
        const result = await runQuery(query, true, {});
        return NextResponse.json({ message: 'success', success: true }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 200 })
    }
}