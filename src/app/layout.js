import Provider from "@/Provider";
import "./globals.css";
import { Toaster } from "sonner";
import StoreProvider from "@/redux/StoreProvider";

export const metadata = {
  title: "GROZO | 10M + Delivery App",
  description: "Grozo - Fast, fresh & reliable grocery delivery app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className=" min-h-screen w-full bg-linear-to-br from-[#0B0F0E] via-[#111827] to-[#020617] text-white">


        {/* 🧠 HIM DIRECT YAHA PR HI SESSION KO USE KR SKTE HII BUT SESSION KE LIYE USE-CLIENT USE KRNA PADEGA TO  ISE HUM CLIENT COMPONENT NHI BANA SKTE KYUKI METADATA JO UPR HII YE KEVL SERVERCOMPONENT PE KAM KRTA HII */}
        <Provider>

          <StoreProvider> {/* 🧠YAHA REDUX KO REP KIYE  */}

            {children}

          </StoreProvider>

        </Provider>

        <Toaster />
      </body>

    </html>
  );
}