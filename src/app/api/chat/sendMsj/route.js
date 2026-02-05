// import dbConnect from "@/connectDb/dbConnect";
// import MessageModel from "@/models/messageModel";
// import Order from "@/models/orderModel";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//        try {
//               await dbConnect();

//               const { chatId, senderId, message } = await req.json();

//               if (!chatId || !senderId || !message) {
//                      return NextResponse.json(
//                             { success: false, message: "chatId, senderId or message missing" },
//                             { status: 400 }
//                      );
//               }

//               const chatRoom = await Order.findById(chatId);
//               if (!chatRoom) {
//                      return NextResponse.json(
//                             { success: false, message: "Chat room not found" },
//                             { status: 404 }
//                      );
//               }

//               const newMessage = await MessageModel.create({chatId, senderId, message,});


//               return NextResponse.json(
//                      { success: true, data: newMessage },
//                      { status: 201 }
//               );

//        } catch (error) {
//               console.error("Send message error:", error);

//               return NextResponse.json(
//                      { success: false, message: "Internal server error" },
//                      { status: 500 }
//               );
//        }
// }



import dbConnect from "@/connectDb/dbConnect";
import MessageModel from "@/models/messageModel";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function POST(req) {
       try {
              await dbConnect();

              const { chatId, senderId, message ,time } = await req.json();

              if (!chatId || !senderId || !message || !time) {
                     return NextResponse.json(
                            { success: false, message: "chatId, senderId , time or message missing" },
                            { status: 400 }
                     );
              }

              // ✅ verify order exists
              const order = await Order.findById(chatId);
              if (!order) {
                     return NextResponse.json(
                            { success: false, message: "Chat room not found" },
                            { status: 404 }
                     );
              }

              const newMessage = await MessageModel.create({
                     chatId,
                     senderId,
                     message,
                     time: new Date().toLocaleTimeString(),
              });

              return NextResponse.json(
                     { success: true, data: newMessage },
                     { status: 201 }
              );
       } catch (error) {
              console.error("Send message error:", error);

              return NextResponse.json(
                     { success: false, message: "Internal server error" },
                     { status: 500 }
              );
       }
}
