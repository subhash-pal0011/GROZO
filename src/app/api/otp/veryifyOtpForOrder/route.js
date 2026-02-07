import twilio from "twilio";
import { NextResponse } from "next/server";
import dbConnect from "@/connectDb/dbConnect";
import Order from "@/models/orderModel";
import DeliveryAssignment from "@/models/deliveryAssignmentSchema";

const client = twilio(
       process.env.TWILIO_ACCOUNT_SID,
       process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
       try {
              await dbConnect();

              const { orderId, otp } = await req.json();
              if (!orderId || !otp) {
                     return NextResponse.json(
                            { success: false, message: "orderId & otp required" },
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

              const check = await client.verify.v2
                     .services(process.env.TWILIO_VERIFY_SERVICE_SID)
                     .verificationChecks.create({
                            to: `+91${order.address.mobile}`,
                            code: otp,
                     });

              if (check.status !== "approved") {
                     return NextResponse.json(
                            { success: false, message: "Invalid OTP" },
                            { status: 400 }
                     );
              }

              order.deliveryVerification = true;
              order.orderStatus = "delivered";
              order.deliveredAt = new Date();
              await order.save();

              await DeliveryAssignment.findOneAndUpdate(
                     { orderId: order._id },
                     { deliveryStatus: "delivered" }
              );

              // >>>> IMPORTENT LINE JO MAP ARHA THA OTP VERIFY HONE KE BAD PAGE RELOD KE TIME IS LIYE
              // Step 5: DeliveryAssignment bhi update karo
              // Ye bahut important hai warna reload pe map wapas aa jayega
              await DeliveryAssignment.findOneAndUpdate(
                     { orderId: order._id },           // Same order ka assignment
                     { deliveryStatus: "delivered" }   // Assignment complete
              );

              return NextResponse.json({
                     success: true,
                     message: "Order delivered successfully",
              });

       } catch (error) {
              console.error("OTP Verify Error:", error);
              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}
