import dbConnect from "@/connectDb/dbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
       try {
              await dbConnect();

              const { email, otp } = await req.json();

              if (!email || !otp) {
                     return NextResponse.json(
                            { message: "Email aur OTP required" },
                            { status: 400 }
                     );
              }

              const existUser = await User.findOne({ email });

              if (!existUser) {
                     return NextResponse.json(
                            { message: "User does not exist" },
                            { status: 404 }
                     );
              }

              if (existUser.isVerified) {
                     return NextResponse.json(
                            { message: "User already verified" },
                            { status: 400 }
                     );
              }

              if (existUser.otp !== otp) {
                     return NextResponse.json(
                            { message: "OTP does not match" },
                            { status: 400 }
                     );
              }

              if (Date.now() > existUser.otpExpires) {
                     return NextResponse.json(
                            { message: "OTP expired" },
                            { status: 400 }
                     );
              }

              existUser.isVerify = true;
              existUser.otp = null;
              existUser.otpExpires = null;

              await existUser.save();

              return NextResponse.json(
                     {
                            message: "Email verified successfully",
                            data: existUser,
                     },
                     { status: 200 }
              );
       } catch (error) {
              console.error("Verify OTP error:", error);
              return NextResponse.json(
                     { message: "Something went wrong" },
                     { status: 500 }
              );
       }
}
