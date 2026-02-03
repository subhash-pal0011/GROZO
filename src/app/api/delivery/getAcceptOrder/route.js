import { auth } from "@/auth";
import dbConnect from "@/connectDb/dbConnect";
import DeliveryAssignment from "@/models/deliveryAssignmentSchema";

export async function GET(req) {
       try {
              await dbConnect();

              const session = await auth();
              if (!session || !session.user?.id) {
                     return Response.json(
                            { success: false, message: "Unauthorized" },
                            { status: 401 }
                     );
              }

              const deliveryBoyId = session.user.id;

              // Jo order delivery boy ko assign hua hai (assigned / accepted) o fund kr rhe hii.
              const assignment = await DeliveryAssignment.findOne({
                     deliveryBoyId: deliveryBoyId,
                     deliveryStatus: "accepted",
              })
                     .populate({
                            path: "orderId",
                            select: "items address priceDetails orderStatus paymentMethod",
                     })
                     .populate({
                            path: "customerId", // JI USER KA ORDER LEKR JA RHE HII UNKA BHI INFO CHHAIYE       
                            select: "name mobile",
                     })
                     .lean(); // read-only hai, fast

              if (!assignment) {
                     return Response.json({
                            success: true,
                            message: "No assigned order found",
                            data: null,
                     });
              }

              return Response.json({
                     success: true,
                     data: assignment,
              });

       } catch (error) {
              console.error("Delivery assignment GET error:", error);
              return Response.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}
