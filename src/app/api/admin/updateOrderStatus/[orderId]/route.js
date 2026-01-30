import { NextResponse } from "next/server";
import dbConnect from "@/connectDb/dbConnect";
import Order from "@/models/orderModel";
import User from "@/models/user";
import DeliveryAssignment from "@/models/deliveryAssignmentSchema";

export async function POST(req, { params }) {
       try {
              await dbConnect();
              const { orderId } = await params;
              const { status } = await req.json();
              if (!orderId || !status) {
                     return NextResponse.json(
                            { success: false, message: "orderId and status are required" },
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

              order.orderStatus = status;
              await order.save();

              // order.deliveryBoyId mtlb koi bhi order ko koi deliver accsept nhi kiya o deliveryBy
              if (status === "confirmed" && !order.deliveryBoyId) {

                     const { latitude, longitude } = order.address;

                     // JO ORDER LEKR JA RHE HII DE_BOY UNHE ISI TRIKE SE NIKALENGE.
                     const busyAssignments = await DeliveryAssignment.find({ 
                            deliveryStatus: { $in: ["accepted", "out_for_delivery"] }// JINK STATUS YE SB NHI HII
                     }).select("deliveryBoyId"); // SELECT KR LO DELIVERY BOY UN SB KO

                     const busyBoyIds = busyAssignments.map(a => a.deliveryBoyId);

                     const nearbyDeliveryBoys = await User.find({
                            role: "delivery",
                            isOnline: true,
                            _id: { $nin: busyBoyIds },
                            location: {
                                   $near: {
                                          $geometry: {
                                                 type: "Point",
                                                 coordinates: [longitude, latitude],
                                          },
                                          $maxDistance: 10000,
                                   },
                            },
                     }).select("name mobile");

                     if (nearbyDeliveryBoys.length === 0) {
                            return NextResponse.json({
                                   success: true,
                                   deliveryBoyAssigned: false,
                                   message: "Order confirmed (no delivery boy nearby)",
                            });
                     }

                     const assignments = [];

                     for (const boy of nearbyDeliveryBoys) {
                            const assignment = await DeliveryAssignment.create({
                                   orderId: order._id,
                                   customerId: order.user,
                                   deliveryBoyId: boy._id,
                                   deliveryStatus: "assigned",
                                   paymentMode: order.paymentMethod.toUpperCase(),
                            });
                            assignments.push(assignment);
                     }

                     return NextResponse.json({
                            success: true,
                            deliveryBoyAssigned: true,
                            message: "Order confirmed & delivery boys assigned",
                            assignments,
                     });
              }
              return NextResponse.json({
                     success: true,
                     message: "Order status updated successfully",
                     status: order.orderStatus,
              });

       } catch (error) {
              console.error("updateOrderStatus error:",error);
              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}


