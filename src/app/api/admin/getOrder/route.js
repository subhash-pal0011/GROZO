import dbConnect from "@/connectDb/dbConnect";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function GET() {
       try {
              await dbConnect();

              const orders = await Order.find().populate("user").sort({createdAt:-1});

              if (orders.length === 0) {
                     return NextResponse.json(
                            {
                                   success: true,
                                   message: "No orders found",
                                   data: [],
                            },
                            { status: 200 }
                     );
              }

              return NextResponse.json(
                     {
                            success: true,
                            data: orders,
                     },
                     { status: 200 }
              );
       } catch (error) {
              console.error("GET orders error:", error);
              return NextResponse.json(
                     {
                            success: false,
                            message: "Internal Server Error",
                     },
                     { status: 500 }
              );
       }
}