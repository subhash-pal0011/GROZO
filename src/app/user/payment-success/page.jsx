"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";


const page = () => {
  const route = useRouter()
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-green-100 text-gray-600 gap-4 px-4">
      <motion.div
        initial={{
          y: 60, opacity: 0
        }}
        animate={{
          y: 0, opacity: 1
        }}
        transition={{
          duration: 0.5
        }}
        className="flex flex-col items-center gap-3"
      >
        <Image src="/success.gif" height={120} width={120} alt="success" />

        <p className="text-lg font-semibold text-center">
          Hi, Order Placed Successfully 🎉
        </p>

        <p className="text-sm font-semibold text-blue-500 text-center">
          Get ready to enjoy 😊 your fresh groceries at home!
        </p>

        <button onClick={()=> route.push("/user/myOrder")}
         className="flex items-center justify-center border border-blue-400 px-4 py-2 rounded mt-5 cursor-pointer hover:bg-blue-50 transition-all">
          <p className="text-sm font-semibold mr-2">Go to My Order</p>
          <img src="/next.gif" alt="next" className="h-6 w-6" />
        </button>
      </motion.div>
    </div>
  );
};

export default page;
