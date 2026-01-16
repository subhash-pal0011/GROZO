import { NextResponse } from "next/server"
import { auth } from "./auth"

export async function proxy(request) {

       const session = await auth() //USE-SESSION() KYU NHI LIKHA GYA HII NA NEXTJS KE 16-V5 MEA AUTH A GYA HII IS LIYE

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

       const role = session?.user?.role
       console.log(`role : ${role}`)
       if(pathname.startsWith("/user") && role !=="user"){
              return NextResponse.redirect(new URL("/unAuthroize" , req.url))
       }
       if(pathname.startsWith("/admin") && role !== "admin"){
              return NextResponse.redirect(new URL("/unAuthroize" , req.url))
       }
       if(pathname.startsWith("/delivery") && role !=="delivery"){
              return NextResponse.redirect(new URL("/unAuthroize" , req.url))
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

       matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)$).*)'],
}