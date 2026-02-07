import { auth } from "@/auth";
import dbConnect from "@/connectDb/dbConnect";
import DeliveryAssignment from "@/models/deliveryAssignmentSchema";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
       try {
              await dbConnect();

              const { id } = await params;
              const session = await auth();
              const deliveryBoyId = session?.user?.id;

              if (!deliveryBoyId) {
                     return NextResponse.json(
                            { success: false, message: "Delivery Boy Unauthorized" },
                            { status: 401 }
                     );
              }

              // const assignment = await DeliveryAssignment.findById(id);
              const assignment = await DeliveryAssignment.findById(id)
                     .populate("orderId"); // 🔥 ADD THIS

              if (!assignment) {
                     return NextResponse.json(
                            { success: false, message: "Assignment not found" },
                            { status: 404 }
                     );
              }

              //🧠 Security: sirf assigned delivery boy hi accept kar sakta aur koi nhi is liye check jaruri hii.
              if (assignment.deliveryBoyId.toString() !== deliveryBoyId) {
                     return NextResponse.json(
                            { success: false, message: "Not your assignment" },
                            { status: 403 }
                     );
              }

              //🧠 assigned = mtlb Order abhi delivery boy ko diya gaya hai lekin abhi tak kisi ne accept nahi kiya. 
              if (assignment.deliveryStatus !== "assigned") { //🧠 AGR EQUAL NHI HII TO JAHIR SI BATA HII ORDER JA CHUKA HII
                     return NextResponse.json(
                            { success: false, message: "Order already handled" },
                            { status: 400 }
                     );
              }

              //🧠 Taaki ek delivery boy ek time par sirf ek hi active order accept kar sake, multiple orders ek saath na le paaye.
              const boyBusy = await DeliveryAssignment.findOne({
                     deliveryBoyId,
                     deliveryStatus: { $in: ["accepted", "out_for_delivery"] }
              });
              if (boyBusy) {
                     return NextResponse.json(
                            {
                                   success: false,
                                   message: "You already have an active delivery",
                            },
                            { status: 409 }
                     );
              }

              const alreadyAccepted = await DeliveryAssignment.findOne({
                     orderId: assignment.orderId, // 🧠AGR USER KE UNDER ORDER ID HII AUR 
                     deliveryStatus: "accepted", //🧠AUR DELIVERsTATUS ACCEPTED HII TO ORDER LEKR JA RHA HII.
              });

              if (alreadyAccepted) {
                     assignment.deliveryStatus = "cancelled";  //🧠 1 AGR ALRDEY KOI ORDER LEK JA RHA HII deliveryStatus CANCELL KRO.
                     await assignment.save();

                     return NextResponse.json(
                            { success: false, message: "Order already taken by another delivery boy" },
                            { status: 409 }
                     );
              }

              //🧠 2 deliveryStatus  NHI TO ACCEPT KRO
              assignment.deliveryStatus = "accepted";
              await assignment.save();


              await DeliveryAssignment.updateMany( // 🧠 UPDATE IS LIYE KRA RHE HII KYUKI AGR DELIVERY BOY EK ACCEPT KIYA BAKI HAT JAYE ACCEPT NA KR PYE IS LIYE.
                     {
                            deliveryBoyId,
                            _id: { $ne: assignment._id },
                            deliveryStatus: "assigned"
                     },
                     { $set: { deliveryStatus: "cancelled" } }
              );

              const order = await Order.findById(assignment.orderId); // 1 ORDER FIND KRKE  update kr do .
              order.orderAssignd = assignment._id; // JO ORDER KE UNDER orderAssignd ISE BATA DENGE ORDER KE LIYE DELIVERY BOY ASSIN HO CHUKA HII.
              order.orderStatus = "out_for_delivery"; // ORDER STATUS MEA BATA DO OUT FOR DELIVERY MTLB ORDER LEKR NIKL GYA HII.
              await order.save();


              return NextResponse.json({
                     success: true,
                     message: "Order accepted successfully",
                     data: assignment
              });
       } catch (error) {
              console.error("Accept order error:", error);
              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}




