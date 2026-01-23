import dbConnect from "@/connectDb/dbConnect";
import Order from "@/models/orderModel";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
       try {
              await dbConnect();

              const {user,items,paymentMethod,address,totalAmount,} = await req.json();

              if (!user || !items || !address || !totalAmount || !paymentMethod) {
                     return NextResponse.json(
                            { success: false, message: "All required fields missing" },
                            { status: 400 }
                     );
              }

              const userExist = await User.findById(user);
              if (!userExist) {
                     return NextResponse.json(
                            { success: false, message: "User does not exist in database"},
                            { status: 404 }
                     );
              }

              const newOrder = await Order.create({
                     user: userExist._id,
                     items,
                     paymentMethod,
                     paymentStatus,
                     orderStatus,
                     address,
                     totalAmount,
              });

              return NextResponse.json(
                     {
                            success: true,
                            message: "Order placed successfully",
                            data: newOrder,
                     },
                     { status: 201 }
              );
       } catch (error) {
              console.error("Order create error:", error);
              return NextResponse.json(
                     {
                            success: false,
                            message: "Internal server error",
                     },
                     { status: 500 }
              );
       }
}

