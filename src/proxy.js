import { NextResponse } from "next/server"
import { auth } from "./auth"

export async function proxy(request) {
       const session = await auth()

       const pathname = request.nextUrl.pathname

       // Public routes (login & register) MTLB YE SARE ROUTE WITHOT LOGIN SIGNUP KE DIKHENGE.
       const isPublicPath = pathname === "/login" || pathname === "/register"
              

       // 🔐 AGR LOGIN SIGNUP HII USER AUR TOKEN BHI HII TO USE REDIRECT KR DO / HOME PAGE PR KISI PR BHI KRA SKTE HO.
       if (isPublicPath && session) {
              return NextResponse.redirect(new URL("/", request.url))
       }

       // NHI HII TO REDIRECT KR DO 
       if (!isPublicPath && !session) {
              return NextResponse.redirect(new URL("/register", request.url))
       }

       return NextResponse.next()
}

export const config = {
       // matcher: [ // YAHA PE O PAGE KA ROUTE LIKHTE HII JIS PE UPER VALA KAM KRE LOGIC. 
       //        "/",
       //        "/login",
       //        "/register",
       //        "/dashboard/:path*",
       // ],


       matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}