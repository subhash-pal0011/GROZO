import { auth } from "@/auth";
import dbConnect from "@/connectDb/dbConnect";
import DeliveryAssignment from "@/models/deliveryAssignmentSchema";

export async function GET() {
       try {
              await dbConnect();
              const session = await auth();
              if (!session?.user) {
                     return new Response(
                            JSON.stringify({ success: false, message: "Not authenticated" }),
                            { status: 401 }
                     );
              }

              const deliveryBoyId = session.user.id;

              const notifications = await DeliveryAssignment.find({
                     deliveryBoyId,
                     deliveryStatus: { $in: ["assigned", "accepted", "out_for_delivery"] }//💡 unhi order ko dikhna hii jo humne accept kiya aur jin aorder ko lekr nikla hum mtlb[out_for_delivery]
              })
                     .populate("orderId", "orderStatus address paymentMethod")
                     .populate("customerId", "name mobile")
                     .sort({ createdAt: -1 });

              return new Response(
                     JSON.stringify({ success: true, data: notifications }),
                     { status: 200 }
              );
       } catch (error) {
              console.error("Fetch notifications error:", error);
              return new Response(
                     JSON.stringify({ success: false, message: "Server error" }),
                     { status: 500 }
              );
       }
}
