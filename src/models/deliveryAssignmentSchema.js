
// ISKO IS LIYE BANA PADA , Ye model order aur delivery boy ke beech ka connection aur delivery ka status track karta hai.

import mongoose from "mongoose";

const deliveryAssignmentSchema = new mongoose.Schema(
       {
              orderId: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "Order",
                     required: true,
              },

              customerId: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "User",
                     required: true,
              },

              deliveryBoyId: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "User", // delivery boy bhi User hi hai (role = delivery ka hii bs)
                     required: true,
              },

              // 👇 Delivery boy ke workflow ke liye
              deliveryStatus: {
                     type: String,
                     enum: [
                            "assigned",          // admin ne delivery boy ko diya
                            "accepted",          // delivery boy ne accept kiya
                            "out_for_delivery",  // order leke nikla
                            "delivered",         // successfully delivered
                            "cancelled",         // admin / system cancel
                     ],
                     default: "assigned",
              },

              expectedDeliveryTime: {
                     type: Date,
              },

              paymentMode: {
                     type: String,
                     enum: ["COD", "ONLINE"],
                     required: true,
              },

              isPaid: {
                     type: Boolean,
                     default: false,
              },
       },
       { timestamps: true }
);

export default mongoose.models.DeliveryAssignment ||
mongoose.model("DeliveryAssignment", deliveryAssignmentSchema);
       

