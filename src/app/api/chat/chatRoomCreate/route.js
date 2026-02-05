// import dbConnect from "@/connectDb/dbConnect";
// import ChatModel from "@/models/chatModel";
// import { NextResponse } from "next/server";
// // delete
// export async function POST(req) {
//        try {
//               await dbConnect();

//               const { userId, deliveryBoyId, orderId } = await req.json();

//               if (!userId || !deliveryBoyId || !orderId) {
//                      return NextResponse.json(
//                             { success: false, message: "userId, deliveryBoyId or orderId missing" },
//                             { status: 400 }
//                      );
//               }

//               let room = await ChatModel.findOne({ orderId });
//               if (!room) {
//                      room = await ChatModel.create({
//                             userId,
//                             deliveryBoyId,
//                             orderId,
//                      });
//               }

//               return NextResponse.json(
//                      { success: true, data: room },
//                      { status: 200 }
//               );

//        } catch (error) {
//               console.error("Create chat error:", error);

//               return NextResponse.json(
//                      { success: false, message: "Internal server error" },
//                      { status: 500 }
//               );
//        }
// }
