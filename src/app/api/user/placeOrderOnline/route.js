import dbConnect from "@/connectDb/dbConnect";
import Order from "@/models/orderModel";
import User from "@/models/user";
import Address from "@/models/userAdressModel";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
       try {
              await dbConnect();

              const { user, items, paymentMethod, address, totalAmount } =
                     await req.json();

              if (!user || !items || !address || !totalAmount || !paymentMethod) {
                     return NextResponse.json(
                            { success: false, message: "All required fields are required" },
                            { status: 400 }
                     );
              }

              const userExist = await User.findById(user);
              if (!userExist) {
                     return NextResponse.json(
                            { success: false, message: "User does not exist" },
                            { status: 404 }
                     );
              }

              const userAddress = await Address.findById(address);
              if (!userAddress) {
                     return NextResponse.json(
                            { success: false, message: "Address not found" },
                            { status: 404 }
                     );
              }

              // 4️⃣ 🔥 Quantity limit check (MAX 3)
              const invalidItem = items.find((item) => item.qty > 3);
              if (invalidItem) {
                     return NextResponse.json(
                            {
                                   success: false,
                                   message: `Maximum 3 quantity allowed for ${invalidItem.name}`,
                            },
                            { status: 400 }
                     );
              }

              const formattedItems = items.map((item) => ({
                     grocery: item._id,
                     name: item.name,
                     price: item.price,
                     unit: item.unit,
                     image: item.image,
                     quantity: item.qty,
              }));

              // 6️⃣ Order create (payment pending)
              const newOrder = await Order.create({
                     user: userExist._id,
                     items: formattedItems,
                     paymentMethod,
                     paymentStatus: "pending",
                     orderStatus: "placed",
                     address: userAddress,
                     totalAmount,
              });

              // 7️⃣ Stripe session
              const session = await stripe.checkout.sessions.create({
                     payment_method_types: ["card"],
                     mode: "payment",
                     success_url: "http://localhost:3000/user/payment-success",
                     cancel_url: "http://localhost:3000/user/payment-failed",

                     line_items: [
                            {
                                   price_data: {
                                          currency: "inr",
                                          product_data: {
                                                 name: "GROZO Order",
                                          },
                                          unit_amount: totalAmount * 100, // ✅ rupees → paise
                                   },
                                   quantity: 1,
                            },
                     ],

                     metadata: {
                            orderId: newOrder._id.toString(),
                            userId: userExist._id.toString(),
                     },
              });

              // 8️⃣ FINAL RESPONSE
              return NextResponse.json(
                     {
                            success: true,
                            message: "Stripe session created",
                            sessionId: session.id,
                            url: session.url,
                     },
                     { status: 200 }
              );
       } catch (error) {
              console.error("Stripe Order Error:", error);
              return NextResponse.json(
                     { success: false, message: "Internal server error" },
                     { status: 500 }
              );
       }
}