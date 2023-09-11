import { NextRequest, NextResponse } from "next/server";

export function middleware(request) {
    const path = request.nextUrl.pathname;
    let isPublic = (path === '/login' || path === '/signup' || path === '/home' || path === '/');
    
    if (path === '/') {
        return NextResponse.redirect(new URL('/home', request.nextUrl));
    }
    
    const token = request.cookies.get('current_user')?.value || '';

    if (!token && !isPublic) {
        return NextResponse.redirect(new URL('/home?log=false', request.nextUrl));
    }

    // If none of the conditions are met, you should return the original request.
    // return request;
}

export const config = {
    matcher: [
        '/',
        '/profile/:path*',
        '/recipe/:path*',
        '/shopping/:path*',
        '/mealplan/:path*',
        '/search/:path*',
        '/settings/:path*',
        '/login',
        '/signup',
    ]
}
