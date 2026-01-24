import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
       {
              user: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "User",
                     required: true,
              },

              items: [
                     {
                            grocery: {
                                   type: mongoose.Schema.Types.ObjectId,
                                   ref: "Grozo",
                                   required: true,
                            },
                            name: {
                                   type: String,
                                   required: true,
                            },
                            price: {
                                   type: Number,
                                   required: true,
                            },
                            unit: String,
                            image: String,
                            quantity: {
                                   type: Number,
                                   required: true,
                                   min: 1, max: 3
                            },
                     },
              ],

              paymentMethod: {
                     type: String,
                     enum: ["cod", "online"],
                     default: "cod",
              },

              paymentStatus: {
                     type: String,
                     enum: ["pending", "paid"],
                     default: "pending",
              },

              isPayed: {
                     type: Boolean,
                     default: false
              }
              ,
              orderStatus: {
                     type: String,
                     enum: ["placed", "confirmed", "delivered", "cancelled"],
                     default: "confirmed",
              },

              address: {
                     name: {
                            type: String,
                            required: true,
                     },
                     mobile: {
                            type: String,
                            required: true,
                     },
                     place: String,
                     city: {
                            type: String,
                            required: true,
                     },
                     state: String,
                     pinCode: {
                            type: String,
                            required: true,
                     },
                     fullAddress: {
                            type: String,
                            required: true,
                     },
                     latitude: Number,
                     longitude: Number,
              },

              totalAmount: {
                     type: Number,
                     required: true,
              },
       },
       { timestamps: true }
);
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
