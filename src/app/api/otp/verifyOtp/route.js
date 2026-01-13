import twilio from "twilio";
import { NextResponse } from "next/server";
import dbConnect from "@/connectDb/dbConnect";
import User from "@/models/user";

const client = twilio(
       process.env.TWILIO_ACCOUNT_SID,
       process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
       await dbConnect();
       const { mobile, otp } = await req.json();

       const check = await client.verify.v2
              .services(process.env.TWILIO_VERIFY_SERVICE_SID)
              .verificationChecks.create({
                     to: `+91${mobile}`,
                     code: otp,
              });

       if (check.status === "approved") {
              await User.findOneAndUpdate(
                     { mobile },
                     { mobileVerified: true }
              );
              return NextResponse.json({ success: true });
       }
       return NextResponse.json(
              { success: false },
              { status: 400 }
       );
}

