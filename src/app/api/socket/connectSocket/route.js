import { NextResponse } from "next/server";
import User from "@/models/user";
import dbConnect from "@/connectDb/dbConnect";

export async function POST(req) {
       try {
              await dbConnect();

              const { userId, socketId } = await req.json();

              if (!userId || !socketId) {
                     return NextResponse.json(
                            {
                                   success: false,
                                   message: "userId and socketId are required",
                            },
                            { status: 400 }
                     );
              }

              const user = await User.findByIdAndUpdate(userId,{socketId, isOnline: true},
                     { new: true } //🧠 Taaki updated user mile, purana nahi
              );

              if (!user) {
                     return NextResponse.json(
                            {success: false,message: "User not found"},
                            { status: 404 }
                     );
              }

              return NextResponse.json(
                     {success: true, message: "Socket ID saved successfully"},
                     { status: 200 }
              );
       } catch (error) {
              console.error("Socket save error:", error);
              return NextResponse.json(
                     {success: false,message: "Internal server error"},
                     { status: 500 }
              );
       }
}