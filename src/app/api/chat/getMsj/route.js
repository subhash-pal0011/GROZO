import dbConnect from "@/connectDb/dbConnect";
import MessageModel from "@/models/messageModel";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function GET(req) {
       try {
              await dbConnect();

              const { searchParams } = new URL(req.url);
              const chatId = searchParams.get("chatId");


              if (!chatId) {
                     return NextResponse.json(
                            { success: false, message: "chatId missing" },
                            { status: 400 }
                     );
              }

              const conversationId = await Order.findById(chatId)
              if (!conversationId) {
                     return NextResponse.json(
                            { success: false, message: "conversation not started" },
                            { status: 400 }
                     )
              }

              const messages = await MessageModel.find({ chatId }).sort({ createdAt: 1 });

              if (!messages) {
                     return NextResponse.json(
                            { succes: false, message: "Message not found" },
                            { status: 400 }
                     )
              }


              return NextResponse.json(
                     { success: true, data: messages },
                     { status: 200 }
              );

       } catch (error) {
              console.error("Get message error:", error);

              return NextResponse.json(
                     { success: false, message: "Internal server error" },
                     { status: 500 }
              );
       }
}



// import dbConnect from "@/connectDb/dbConnect";
// import MessageModel from "@/models/messageModel";
// import Order from "@/models/orderModel";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     await dbConnect();

//     // ✅ GET → query params
//     const { searchParams } = new URL(req.url);
//     const chatId = searchParams.get("chatId");

//     if (!chatId) {
//       return NextResponse.json(
//         { success: false, message: "chatId missing" },
//         { status: 400 }
//       );
//     }

//     // ✅ check order exists (chat started)
//     const order = await Order.findById(chatId);
//     if (!order) {
//       return NextResponse.json(
//         { success: false, message: "Conversation not started" },
//         { status: 404 }
//       );
//     }

//     const messages = await MessageModel.find({ chatId })
//       .sort({ createdAt: 1 })
//       .populate("senderId", "name");

//     return NextResponse.json(
//       { success: true, data: messages },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Get message error:", error);

//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
