import dbConnect from "@/connectDb/dbConnect";
import Grozo from "@/models/grozoModels";
import { NextResponse } from "next/server";

export async function GET() {
       try {
              await dbConnect();

              const groceries = await Grozo.find({});

              if (groceries.length === 0) {
                     return NextResponse.json(
                            { success: false, message: "No grocery found" },
                            { status: 404 }
                     );
              }

              return NextResponse.json(
                     { success: true, data: groceries },
                     { status: 200 }
              );
       } catch (error) {
              console.error("GET GROCERY ERROR:", error);

              return NextResponse.json(
                     { success: false, message: "Internal Server Error" },
                     { status: 500 }
              );
       }
}
