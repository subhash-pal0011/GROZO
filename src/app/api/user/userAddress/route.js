import User from "@/models/user";
import Address from "@/models/userAdressModel";
import { NextResponse } from "next/server";

export async function POST(req) {
       try {
              const { user, name, mobile, city, pinCode, fullAddress, houseNumber, place, state, latitude, longitude, label, } = await req.json();

              if (!user || !name || !mobile || !city || !pinCode || !fullAddress) {
                     return NextResponse.json(
                            { success: false, message: "All required fields missing" },
                            { status: 400 }
                     );
              }

              const existUser = await User.findById(user)
              if (!existUser) {
                     return NextResponse.json(
                            { success: false, message: "user not found" },
                            { status: 404 }
                     )
              }

              const address = await Address.create({
                     user,
                     name,
                     mobile,
                     city,
                     pinCode,
                     fullAddress,
                     houseNumber,
                     place,
                     state,
                     latitude,
                     longitude,
                     label,
              });

              return NextResponse.json(
                     { success: true, data: address }, { status: 201 }
              );
       } catch (error) {
              console.error("Save address error:", error);
              return NextResponse.json(
                     { success: false, message: "Server error" },
                     { status: 500 }
              );
       }
}