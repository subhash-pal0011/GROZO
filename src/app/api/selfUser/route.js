import { auth } from "@/auth";
import User from "@/models/user";
import dbConnect from "@/connectDb/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
       try {
              await dbConnect();

              const session = await auth();

              if (!session || !session.user?.email) {
                     return NextResponse.json(
                            { success: false, message: "User not authenticated" },
                            { status: 401 }
                     );
              }

              const existUser = await User.findOne({email: session.user.email,}).select("-password");
              if (!existUser) {
                     return NextResponse.json(
                            { success: false, message: "User not found" },
                            { status: 404 }
                     );
              }

              return NextResponse.json(
                     { success: true, data: existUser },
                     { status: 200 }
              );
       } catch (error) {
              return NextResponse.json(
                     {success: false, message:`Get self user error ${error.message}`},
                     { status: 500 }
              );
       }
}
