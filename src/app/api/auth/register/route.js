// 🧠 API BN GYI HII >> api/auth/register.
import dbConnect from "@/connectDb/dbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { mailVerification } from "@/utils/mailVerification";


export async function POST(req) {
       try {
              await dbConnect();

              const { name, email, password } = await req.json();

              if (!name || !email || !password){
                     return NextResponse.json(
                            {success:false,message:"All fields are required"},
                            { status:400}
                     );
              }

              const existUser = await User.findOne({ email });
              if (existUser) {
                     return NextResponse.json(
                            {success:false, message:"User already exists"},
                            { status:400}
                     );
              }
              const otp = Math.floor(100000 + Math.random() * 900000).toString();
              const otpExpires = Date.now() + 5 * 60 * 1000;

              await mailVerification(email, otp);

              const hashedPassword = await bcrypt.hash(password, 10);

              const newUser = await User.create({
                     name,
                     email,
                     password: hashedPassword,
                     otp,
                     otpExpires,
              });

              await newUser.save();

              return NextResponse.json(
                     {
                            success:true,
                            data: newUser,
                            message: "New user created successfully",
                     },
                     { status: 201 }
              );
       } catch (error) {
              console.error(`Register error: ${error}`);
              return NextResponse.json(
                     { message: "Something went wrong" },
                     { status: 500 }
              );
       }
}



