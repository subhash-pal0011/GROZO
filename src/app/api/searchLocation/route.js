import { NextResponse } from "next/server";

export async function GET(req) {
       const { searchParams } = new URL(req.url);
       const query = searchParams.get("q");

       if (!query) {
              return NextResponse.json({ error: "Query missing" },{ status: 400});
       }

       const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;


       // 👉 User-Agent header API ko batata hai ki request kaun-si app/website se aa rahi hai, isliye Nominatim bina iske request accept nahi karta.
       const res = await fetch(url, { 
              headers: {
                     "User-Agent": "GrozoApp/1.0 (contact@grozo.com)",
              },
       });

       const data = await res.json();
       return NextResponse.json(data[0] || null);
}

