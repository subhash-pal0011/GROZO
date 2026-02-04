import dbConnect from "@/connectDb/dbConnect";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
       try {
              await dbConnect();

              const { orderId } = await params;

              if (!orderId) {
                     return NextResponse.json(
                            { success: false, message: "Order id is required" },
                            { status: 400 }
                     );
              }

              // Find order jo delivery boy le raha hai DELIVERY BOY UNFO SATH-2 MEA ORDER,ORDER-USER INFO
              const order = await Order.findById(orderId)
                     .populate({
                            path: "orderAssignd", //first orderAssignd iske under
                            populate: {
                                   path: "deliveryBoyId",  // second deliveryBoyId is schema ke under
                                   select: "name mobile location", //therd name mobile location ye-2 chhaiye
                            },
                     });

              if (!order) {
                     return NextResponse.json(
                            { success: false, message: "Order does not exist" },
                            { status: 404 }
                     );
              }

              return NextResponse.json(
                     {
                            success: true,
                            message: "Order fetched successfully",
                            data: order,
                     },
                     { status: 200 }
              );
       } catch (error) {
              console.error("Get order error:", error);
              return NextResponse.json(
                     { success: false, message: "Internal server error" },
                     { status: 500 }
              );
       }
}

