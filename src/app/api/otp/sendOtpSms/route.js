import twilio from "twilio";
import { NextResponse } from "next/server";

const client = twilio(
       process.env.TWILIO_ACCOUNT_SID,
       process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
       const { mobile } = await req.json();

       await client.verify.v2
              .services(process.env.TWILIO_VERIFY_SERVICE_SID)
              .verifications.create({
                     to: `+91${mobile}`,   // 91 hum phle se lagye vrna tumhe nuber likhte time +91 lagna pdta.
                     channel: "sms",
              });

       return NextResponse.json({ success: true });
}
