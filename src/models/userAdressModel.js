import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
       {
              user: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "User",
                     required: true,
              },

              name: {
                     type: String,
                     required: true,
              },

              mobile: {
                     type: String,
                     required: true,
              },

              houseNumber: String,
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

              label: {
                     type: String,
                     enum: ["home", "work"],
                     default: "home",
              },

              isDefault: {
                     type: Boolean,
                     default: false,
              },
       },
       { timestamps: true }
);

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);
export default Address;
