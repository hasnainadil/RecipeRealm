import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'
export async function POST(request) {
    try {
        const response = NextResponse.json({
            message: "Logout successful"
        }, { status: 200 })
        cookies().delete(process.env.TOKEN_NAME)
        return response
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}