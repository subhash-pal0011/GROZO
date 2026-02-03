import { NextResponse } from "next/server";
import dbConnect from "@/connectDb/dbConnect";
import Order from "@/models/orderModel";
import User from "@/models/user";
import DeliveryAssignment from "@/models/deliveryAssignmentSchema";
import eventHandlerForIndexJs from "@/lib/eventHandelerForIndexJs";

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

              // 🔥 USER ko order status update rel time
              await eventHandlerForIndexJs({ event: "order-status-updated", data: { orderId: order._id, status: order.orderStatus, } })


              // order.deliveryBoyId mtlb koi bhi order ko koi deliver accsept nhi kiya o deliveryBy
              if (status === "delivered" && !order.deliveryBoyId) {

                     const { latitude, longitude } = order.address;

                     // JO ORDER LEKR JA RHE HII DE_BOY UNHE ISI TRIKE SE NIKALENGE.
                     const busyAssignments = await DeliveryAssignment.find({
                            deliveryStatus: { $in: ["accepted", "out_for_delivery"] }// JINKA STATUS YE SB NHI HII,
                     }).select("deliveryBoyId"); // SELECT KR LO DELIVERY BOY UN SB KO

                     const busyBoyIds = busyAssignments.map(a => a.deliveryBoyId);

                     const nearbyDeliveryBoys = await User.find({ // DELIVERY BOY GIND KRO JINKA--
                            role: "delivery", //ROLE delivery HO
                            isOnline: true,  // JO ONLINE HO
                            socketId: { $ne: null },  // JINKI SOCKETiD NULL NA TBHI ONLINE CHEK KR PYENGE
                            _id: { $nin: busyBoyIds },  // JO BUSY NA HO
                            location: {
                                   $near: {
                                          $geometry: {
                                                 type: "Point",
                                                 coordinates: [longitude, latitude],
                                          },
                                          $maxDistance: 10000,
                                   },
                            },
                     });

                     if (nearbyDeliveryBoys.length === 0) {
                            return NextResponse.json({
                                   success: true,
                                   message: "Order confirmed but no delivery boy available",
                            });
                     }

                     for (const boy of nearbyDeliveryBoys) {

                            const assignment = await DeliveryAssignment.create({
                                   orderId: order._id,
                                   customerId: order.user,
                                   deliveryBoyId: boy._id,
                                   deliveryStatus: "assigned",
                                   paymentMode: order.paymentMethod.toUpperCase(),
                            });


                            const populatedAssignment = await DeliveryAssignment.findById(assignment._id)
                                   .populate("orderId");
                            await eventHandlerForIndexJs({
                                   event: "new-order-assign",
                                   data: populatedAssignment,
                                   socketId: boy.socketId,
                            });
                     }
              }
              return NextResponse.json({
                     success: true,
                     message: "Order status updated successfully",
                     status: order.orderStatus,
              });

       } catch (error) {
              console.error("updateOrderStatus error:", error);
              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}


