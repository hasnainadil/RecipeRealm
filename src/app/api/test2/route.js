import { NextRequest, NextResponse } from "next/server";

export function GET(request) {
    const { message } = request.json();
    return NextResponse.json({ message: "Hello World", success: true });
}