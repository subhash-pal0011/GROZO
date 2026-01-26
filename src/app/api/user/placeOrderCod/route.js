import dbConnect from "@/connectDb/dbConnect";
import Order from "@/models/orderModel";
import User from "@/models/user";
import Address from "@/models/userAdressModel";
import { NextResponse } from "next/server";

export async function POST(req) {
       try {
              await dbConnect();

              const { user, items, paymentMethod, address, priceDetails } = await req.json();
                     
              if (!user || !items?.length || !address || !paymentMethod || !priceDetails?.totalAmount) {
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

              const formattedItems = items.map((item) => ({ // ITEM KE UNDER HUME MAP KRKE HUME BATANA PADEGA.
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

              return NextResponse.json(
                     { success: true, message: "Order placed successfully", data: newOrder },
                     { status: 201 }
              );
       } catch (error) {
              console.error("Order create error:", error);
              return NextResponse.json(
                     { success: false, message: "Internal server error" },
                     { status: 500 }
              );
       }
}

