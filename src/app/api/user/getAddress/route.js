import dbConnect from "@/connectDb/dbConnect";
import Address from "@/models/userAdressModel";
import { NextResponse } from "next/server";

export async function GET(req) {
       try {
              await dbConnect();

              const { searchParams } = new URL(req.url);
              const userId = searchParams.get("userId");

              if (!userId) {
                     return NextResponse.json(
                            { success: false, message: "User id missing" },
                            { status: 400 }
                     );
              }

              const addresses = await Address.find({ user: userId });

              return NextResponse.json({
                     success: true,
                     data: addresses,
              });
       } catch (error) {
              console.log("Get address error:", error);
              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}
