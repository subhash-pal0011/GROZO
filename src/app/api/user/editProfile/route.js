import { auth } from "@/auth";
import dbConnect from "@/connectDb/dbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
       try {
              await dbConnect();

              const { role, mobile } = await req.json();

              const session = await auth();
              if (!session?.user?.email) {
                     return NextResponse.json(
                            { success: false, message: "Unauthorized" },
                            { status: 401 }
                     );
              }

              const user = await User.findOneAndUpdate(
                     { email: session.user.email },
                     { mobile, role },
                     { new: true } // IS LIYE KYUKI RETURN KRE TO UPDATED DATA
              );


              if (!user) {
                     return NextResponse.json(
                            { success: false, message: "User doesn't exist" },
                            { status: 404 }
                     );
              }
              


              return NextResponse.json(
                     { success: true, data: user },
                     { status: 200 }
              );
       } catch (error) {
              console.error(`Edit Profile error: ${error}`);
              return NextResponse.json(
                     { success: false, message: "Internal Server Error" },
                     { status: 500 }
              );
       }
}
