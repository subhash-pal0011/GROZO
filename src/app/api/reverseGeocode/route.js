import { NextResponse } from "next/server";

export async function GET(req) {
       const { searchParams } = new URL(req.url); // 🔎 URL ke query SE DATA LE LENGE

       const lat = searchParams.get("lat");
       const lon = searchParams.get("lon");

       if (!lat || !lon){
              return NextResponse.json(
                     { error: "lat & lon required" },
                     { status: 400 }
              );
       }

       try {
              const res = await fetch(
                     `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&addressdetails=1`
              );
              const data = await res.json();
              return NextResponse.json(data);
       } 
       catch (err) {
              return NextResponse.json(
                     { error: "Reverse geocoding failed" },
                     { status: 500 }
              );
       }
}
