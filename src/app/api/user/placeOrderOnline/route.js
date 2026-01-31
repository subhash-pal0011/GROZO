import dbConnect from "@/connectDb/dbConnect";
import eventHandlerForIndexJs from "@/lib/eventHandelerForIndexJs";
import Order from "@/models/orderModel";
import User from "@/models/user";
import Address from "@/models/userAdressModel";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
       try {
              await dbConnect();

              const { user, items, paymentMethod, address, priceDetails, } = await req.json();

              if (!user || !items?.length || !address || !paymentMethod || !priceDetails?.totalAmount) {
                     return NextResponse.json(
                            { success: false, message: "All required fields are required" },
                            { status: 400 }
                     );
              }

              const userExist = await User.findById(user);
              if (!userExist) {
                     return NextResponse.json(
                            { success: false, message: "User not found" },
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

              const formattedItems = items.map((item) => ({ // 🧠 ITME EK UNDER BAHOT SARE DATA HII ITEM KO HUMNE EK SMJO CONTAINER BANA DIYA AB ISKE CHHOTE CHHOTE BOX KE UNDER DATA RKHA HII.
                     grocery: item._id,
                     name: item.name,
                     price: item.price,
                     unit: item.unit,
                     image: item.image,
                     quantity: item.qty,
              }));

              const newOrder = await Order.create({
                     user: userExist._id,
                     items: formattedItems,
                     paymentMethod,
                     paymentStatus: "pending",
                     isPayed: false,
                     orderStatus: "placed",
                     address: {
                            name: userAddress.name,
                            mobile: userAddress.mobile,
                            city: userAddress.city,
                            pinCode: userAddress.pinCode,
                            fullAddress: userAddress.fullAddress,
                            latitude: userAddress.latitude,
                            longitude: userAddress.longitude,
                     },
                     priceDetails: {
                            subTotal: priceDetails.subTotal,
                            deliveryCharge: priceDetails.deliveryCharge,
                            platformFee: priceDetails.platformFee,
                            discount: priceDetails.discount || 0,
                            totalAmount: priceDetails.totalAmount,
                     },
              });

              // "new-order" sirf event name hai, koi bhi custom naam ho sakta hai
              await eventHandlerForIndexJs({ event: "new-order-Online-pay", data: newOrder });

              const session = await stripe.checkout.sessions.create({
                     //  YE SESSION KA SYNTEX HUM STRIPE SE DEKH KR LIKHA HII.
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
                                          unit_amount: priceDetails.totalAmount * 100, // rupees → paise
                                   },
                                   quantity: 1,
                            },
                     ],

                     metadata: {
                            orderId: newOrder._id.toString(),
                            userId: userExist._id.toString(),
                     },
              });

              return NextResponse.json(
                     {
                            success: true,
                            message: "Stripe session created",
                            url: session.url,
                            sessionId: session.id,
                     },
                     { status: 200 }
              );
       } catch (error) {
              console.error("Place order online error:", error);
              return NextResponse.json(
                     { success: false, message: "Internal server error" },
                     { status: 500 }
              );
       }
}
