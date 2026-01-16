import { auth } from "@/auth";
import dbConnect from "@/connectDb/dbConnect";
import cloudinary from "@/lib/cloudinary";
import Grozo from "@/models/grozoModels";
import { NextResponse } from "next/server";

export async function POST(req) {
       try {
              await dbConnect();

              const session = await auth();

              if (!session || session.user.role !== "admin") {
                     return NextResponse.json(
                            { success: false, message: "You are not authorized" },
                            { status: 403 }
                     );
              }

              const formData = await req.formData();

              const name = formData.get("name")?.trim();
              const types = formData.get("types");
              const price = formData.get("price")?.trim();
              const unit = formData.get("unit");
              const imageFile = formData.get("image");

              if (!name || !types || !price || !unit || !imageFile) {
                     return NextResponse.json(
                            { success: false, message: "All fields are required" },
                            { status: 400 }
                     );
              }

              // ✅ Convert File → Buffer  HUM ISKO EK ALG FILE MEA NANA KR BHI USE KR SKTE HII.
              const bytes = await imageFile.arrayBuffer();
              const buffer = Buffer.from(bytes);

              // ✅ Upload to Cloudinary
              const uploadResult = await new Promise((resolve, reject) => {
                     cloudinary.uploader.upload_stream(
                            { folder: "grozo_products" },
                            (error, result) => {
                                   if (error) reject(error);
                                   resolve(result);
                            }
                     ).end(buffer);
              });
              

              const newProduct = await Grozo.create({
                     name,
                     types,
                     price,
                     unit,
                     image: uploadResult.secure_url,
              });

              return NextResponse.json(
                     { success: true, message: "Product added successfully", data: newProduct },
                     { status: 201 }
              );
       } catch (error) {
              console.error("Add Product Error:", error);
              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}
