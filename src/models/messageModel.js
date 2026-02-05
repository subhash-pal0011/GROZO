import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
       {
              chatId: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "Order", //  CHAT ROOM YAHA SE LE LENGE
                     required: true,
              },

              senderId: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "User",
                     required: true,
              },

              message: {
                     type: String,
                     required: true,
                     trim: true,
              },

              time: {
                     type: String,
              },
       },
       { timestamps: true }
);

const MessageModel =
       mongoose.models.MessageModel ||
       mongoose.model("MessageModel", messageSchema);

export default MessageModel;

