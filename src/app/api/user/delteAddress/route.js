import dbConnect from "@/connectDb/dbConnect";
import Address from "@/models/userAdressModel";
import { NextResponse } from "next/server";

export async function DELETE(req) {
       try {
              await dbConnect()
              const { searchParams } = new URL(req.url)
              const addressId = searchParams.get("addressId")

              if (!addressId) {
                     return NextResponse.json(
                            {
                                   success: false,
                                   message: "AddressId missing"
                            },
                            { status: 400 }
                     )
              }
              await Address.findByIdAndDelete(addressId)

              return NextResponse.json({
                     success: true,
                     message: "Address deleted successfully",
              });
       } catch (error) {
              console.log("delete address error", error);
              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}