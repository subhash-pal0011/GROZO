import dbConnect from "@/connectDb/dbConnect";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function GET() {
       try {
              await dbConnect();

              const orders = await Order.find()
                     .populate("user")
                     .populate({ // ITNA LMBA POPULATE KESE KR RHE HII PATA HII DEKHO ORDER SCHEMA KE UNDER orderAssignd HII ISKE UNDER deliveryBoyId HII , deliveryBoyId SE DELIVERY BOY KA SARA DATA NIKAL LENGE , 2 OPTION IRDE SCHEMA MEA HI DELIVERY BOY KI ID RKH DE DIRECT JESE USER KO POPULATE KRA RHE HII ESE ISE BHI KR LENGE
                            path: "orderAssignd",
                            populate: {
                                   path: "deliveryBoyId",
                                   select: "name mobile profilePic"
                            }
                     })
                     .sort({ createdAt: -1 });


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