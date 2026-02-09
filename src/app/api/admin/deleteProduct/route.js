import { auth } from "@/auth";
import dbConnect from "@/connectDb/dbConnect";
import Grozo from "@/models/grozoModels";
import { NextResponse } from "next/server";

export async function DELETE(req) {
       try {
              await dbConnect();

              // 🔐 Auth check
              const session = await auth();
              if (!session || session.user.role !== "admin") {
                     return NextResponse.json(
                            { success: false, message: "Unauthorized" },
                            { status: 403 }
                     );
              }

              // 📥 Get ID
              const { id } = await req.json();

              if (!id) {
                     return NextResponse.json(
                            { success: false, message: "Product id is required" },
                            { status: 400 }
                     );
              }

              // 🗑️ Delete product
              const deletedProduct = await Grozo.findByIdAndDelete(id);

              if (!deletedProduct) {
                     return NextResponse.json(
                            { success: false, message: "Product not found" },
                            { status: 404 }
                     );
              }

              return NextResponse.json(
                     { success: true, message: "Product deleted successfully" },
                     { status: 200 }
              );

       } catch (error) {
              console.error("Delete Grocery Error:", error);
              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}
