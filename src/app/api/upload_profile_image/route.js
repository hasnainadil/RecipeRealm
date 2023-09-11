import { NextRequest, NextResponse } from "next/server";
import { writeFile } from 'fs/promises'
import runQuery from "@/utils/database_manager";

export async function POST(request) {
    try {
        const data = await request.formData();
        const file = data.get('file')
        console.log(data.get('id'))
        if (!file) {
            return NextResponse.json({ success: false })
        }
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filename = `${data.get('user_id')}.png`
        await writeFile(`./public/profile_images/${filename}`, buffer)
        const query = `UPDATE USERS SET PROFILE_PICTURE = '${filename}' WHERE USER_ID = ${data.get('user_id')}`
        await runQuery(query, true, {})
        return NextResponse.json({ success: true })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ success: false, massage: err })
    }
}