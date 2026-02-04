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
              socketId:{
                     type:String,
                     default:null
              },
              isOnline:{
                     type:Boolean,
                     default:false
              },
              
              // password: {
              //        type: String,
              //        required: function () { // JB USER FORM SE REGISTER HOGA TO PASSWORD REQUIERD RHEGA.
              //               return this.provider === "credentials"
              //        }

              // },
              
              password: {
                     type: String,
                     required: false,
              },
              provider: { // iska use user email + password (credentials) se bhi login/signup kar sake aur Google / GitHub (OAuth) se bhi login/signup kar sake
                     type: String,
                     enum: ["credentials", "google", "github"],
                     default: "credentials",
              },

              mobile: {
                     type: String,
                     trim: true,
              },

              mobileVerified: {
                     type: Boolean,
                     default: false,
              },

              role: {
                     type: String,
                     enum: ["user", "admin", "delivery"],
                     default: "user",
              },
              profilePic: {
                     type: String,
                     default: ""
              },

              //📌 ISKO IS LIYE USE KR RHE HII DELIVERY BOY KO 4 ,5 KM KE UDER FIND KE LIYE YE AYEGA MONGODB LOCATION SE
              // 📍 GeoJSON location (Delivery boy radius search ke liye)
              location: {
                     type: {
                            type: String,
                            enum: ["Point"],
                            default: "Point",
                     },
                     coordinates: { // ISKE UNDER HI  LETITUDE , LONGITUDE RHATA HGII
                            type: [Number], // [longitude, latitude]
                            default: [0, 1], 
                     },
              },
              
              
       },
       { timestamps: true }
);

userSchema.index({location:"2dsphere"}) // “2dsphere index allows efficient geospatial queries like finding nearby users or delivery agents based on latitude and longitude.”



//🔥 Next.js me hot reload ke kaaran model multiple times compile hota hai,isliye mongoose.models ka check lagate hain

//🔥 mongoose.models.User isliye use karte hain taaki Next.js / hot-reload ke time model dobara define na ho Agar User model pehle se exist karta hai to wahi use hoga, warna naya model create hoga.
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
