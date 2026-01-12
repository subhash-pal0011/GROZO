import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
       throw new Error("Please define MONGODB_URI in .env.local");
}

//🧠  global ISKE LIYE TYPE SCRIPT MEA -- JavaScript me freedom hoti hai, TypeScript me permission leni padti hai.
let cached = global.mongoose;

if (!cached) {
       // 🧠                        conn MTLB CONNECTION.
       cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
       if (cached.conn) { //🧠 AGR CACHED KE UNDER CONNECTION HII TO.
              return cached.conn; // 🧠RETURN KR DO CONNECTION KO.
       }

       if (!cached.promise){  //🧠 AGR NHI HII TO BANAO CONNECTION.
              cached.promise = mongoose.connect(MONGODB_URI, {
                     bufferCommands: false,  //🧠 ISE IS LIYE USE KRTE HII >> Agar DB abhi connect nahi hui. Aur tumne User.find() jaisa query chala diya. To Mongoose us query ko yaad (queue) rakh leta hai.DB connect hote hi baad me chala deta hai.
              });
       }

       cached.conn = await cached.promise;
       return cached.conn;
}

export default dbConnect;
