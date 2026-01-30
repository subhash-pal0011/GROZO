import { NextResponse } from "next/server";
import dbConnect from "@/connectDb/dbConnect";
import User from "@/models/user";

export async function POST(req) {
       try {
              await dbConnect();

              const { userId, location } = await req.json();

              if (!userId || !location?.coordinates) {
                     return NextResponse.json(
                            { success: false, message: "userId and location are required" },
                            { status: 400 }
                     );
              }

              const user = await User.findByIdAndUpdate(
                     userId,
                     { location },
                     { new: true }
              );

              if (!user) {
                     return NextResponse.json(
                            { success: false, message: "User not found" },
                            { status: 404 }
                     );
              }

              return NextResponse.json(
                     { success: true, message: "Location updated successfully" },
                     { status: 200 }
              );
       } catch (error) {
              console.error("Update Location Error:", error);
              return NextResponse.json(
                     { success: false, message: "Internal server error" },
                     { status: 500 }
              );
       }
}