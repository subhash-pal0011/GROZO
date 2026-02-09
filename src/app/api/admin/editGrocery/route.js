import { auth } from "@/auth";
import dbConnect from "@/connectDb/dbConnect";
import Grozo from "@/models/grozoModels";
import { NextResponse } from "next/server";

export async function POST(req) {
       try {
              await dbConnect();

              const session = await auth();
              if (!session || session.user.role !== "admin") {
                     return NextResponse.json(
                            { success: false, message: "Unauthorized" },
                            { status: 403 }
                     );
              }

              const { id, name, price } = await req.json();

              if (!id || !name || !price) {
                     return NextResponse.json(
                            { success: false, message: "All fields required" },
                            { status: 400 }
                     );
              }

              const updated = await Grozo.findByIdAndUpdate(
                     id,
                     { name, price },
                     { new: true }
              );

              if (!updated) {
                     return NextResponse.json(
                            { success: false, message: "Product not found" },
                            { status: 404 }
                     );
              }

              return NextResponse.json(
                     { success: true, message: "Product updated successfully" },
                     { status: 200 }
              );

       } catch (error) {
              console.error("Edit Grocery Error:", error);
              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}


