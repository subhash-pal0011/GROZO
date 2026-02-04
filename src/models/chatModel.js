import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
       {
              userId: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "User",
                     required: true,
              },
              deliveryBoyId: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "User",
                     required: true,
              },
              orderId: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "Order",
                     required: true,
              },
       },
       { timestamps: true }
);
const ChatModel = mongoose.models.ChatModel || mongoose.model("ChatModel", chatSchema);
export default ChatModel;
