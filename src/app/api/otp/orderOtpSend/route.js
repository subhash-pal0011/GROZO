import twilio from "twilio";
import { NextResponse } from "next/server";
import dbConnect from "@/connectDb/dbConnect";
import Order from "@/models/orderModel";

const client = twilio(
       process.env.TWILIO_ACCOUNT_SID,
       process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
       try {
              await dbConnect();

              const { orderId } = await req.json();

              if (!orderId) {
                     return NextResponse.json(
                            { success: false, message: "orderId is required" },
                            { status: 400 }
                     );
              }

              const order = await Order.findById(orderId);
              if (!order) {
                     return NextResponse.json(
                            { success: false, message: "Order not found" },
                            { status: 404 }
                     );
              }

              const mobile = order.address.mobile;

              await client.verify.v2
                     .services(process.env.TWILIO_VERIFY_SERVICE_SID)
                     .verifications.create({
                            to: `+91${mobile}`,
                            channel: "sms",
                     });

              return NextResponse.json({
                     success: true,
                     message: "OTP sent to customer",
              });

       } catch (error) {
              console.error("Send OTP Error:", error);
              return NextResponse.json(
                     { success: false, message: "OTP send failed" },
                     { status: 500 }
              );
       }
}

