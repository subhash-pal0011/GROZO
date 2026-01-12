import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
       {
              name: {
                     type: String,
                     required: true,
              },

              email: {
                     type: String,
                     required: true,
                     unique: true,
              },
              otp: {
                     type: String,
                     default: null
              },

              otpExpires: {
                     type: Date,
                     default: null
              },

              isVerify: {
                     type: Boolean,
                     default: false,
              },

              password: {
                     type: String,
                     required: function () { // JB USER FORM SE REGISTER HOGA TO PASSWORD REQUIERD RHEGA.
                            return this.provider === "credentials"
                     }

              },

              mobile: {
                     type: String,
                     trim: true,
              },

              role: {
                     type: String,
                     enum: ["user", "admin", "delivery"],
                     default: "user",
              },
              profilePic: {
                     type: String,
                     default: ""
              }
       },
       { timestamps: true }
);

//🔥 Next.js me hot reload ke kaaran model multiple times compile hota hai,isliye mongoose.models ka check lagate hain

//🔥 mongoose.models.User isliye use karte hain taaki Next.js / hot-reload ke time model dobara define na ho Agar User model pehle se exist karta hai to wahi use hoga, warna naya model create hoga.
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
