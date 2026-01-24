import { auth } from "@/auth";
import dbConnect from "@/connectDb/dbConnect";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function GET() {
       try {
              await dbConnect();
              const session = await auth();
              if (!session || !session.user?.id) {
                     return NextResponse.json(
                            { success: false, message: "Unauthorized" },
                            { status: 401 }
                     );
              }
              const order = await Order.find({
                     user: session.user.id,
              })
              if (!order) {
                     return NextResponse.json(
                            { success: false, message: "Order does not exist" },
                            { status: 404 }
                     );
              }
              return NextResponse.json(
                     { success: true, data: order },
                     { status: 200 }
              );
       } catch (error) {
              console.error("GET ORDER ERROR:", error);

              return NextResponse.json(
                     { success: false, message: "Internal Server Error" },
                     { status: 500 }
              );
       }
}