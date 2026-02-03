"use client";
import { getSocket } from "@/lib/socket";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const DeliveryBoyDashboard = () => {
  const [data, setData] = useState([]);


  useEffect(() => {
    const getOrderNotification = async () => {
      const res = await axios.get("/api/delivery/getDeliveryAssignment");
      // console.log("🔥 RESPONSE:", res.data.data);
      setData(res.data.data || []);
    };

    getOrderNotification();
  }, []);

  useEffect(() => {
    const socket = getSocket();

    const handleNewOrderAssign = (data) => {
      setData((prev) => [data, ...prev]);
    };

    socket.on("new-order-assign", handleNewOrderAssign);

    return () => socket.off("new-order-assign", handleNewOrderAssign);
  }, []);





  const handelAcceptOrder = async (id) => {
    try {
      const res = await axios.get(`/api/delivery/assignment/accept/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);

        setData((prev) => prev.filter((assignment) => assignment._id === id // sirf current accepted order rakho
        )

        );
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(`accept order Error : ${error}`);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-r from-green-100 via-green-100 to-orange-100 text-gray-800 flex flex-col items-center justify-center md:p-5 p-2">

      {data.length === 0 ? (
        <p>No assignments</p>
      ) : (
        data.map((item) => (
          <div
            key={item?._id}
            className="w-full max-w-xl mb-4 p-4 bg-linear-to-r from-blue-100 via-green-100 to-orange-100 border rounded shadow-sm space-y-2"
          >
            {/* Desktop – full order id */}
            <div className="hidden lg:flex items-center gap-1">
              <p className="font-semibold text-sm">Order Id</p>
              <span>:</span>
              <p className="text-xs font-semibold text-gray-600">
                {item.orderId?._id}
              </p>
            </div>

            {/* Mobile – short order id */}
            <div className="flex lg:hidden items-center gap-1">
              <p className="font-semibold text-sm">Order Id</p>
              <span>:</span>
              <p className="text-xs font-semibold text-gray-600">
                {item.orderId?._id?.slice(-5)}
              </p>
            </div>


            <div className="flex items-center gap-1">
              <p className="font-semibold text-sm ">Order Addres</p> {":"} <p className="text-xs font-semibold text-gray-600 capitalize line-clamp-2">{item?.orderId?.address?.fullAddress}</p>
            </div>

            <div className="flex md:flex-row flex-col md:gap-5 gap-2">
              <button onClick={() => handelAcceptOrder(item?._id)}
                className="border w-full p-1 py-2 text-sm font-semibold border-green-500 hover:bg-green-500 hover:text-gray-100 transition-all duration-300 cursor-pointer">Accept</button>

              <button className="border w-full p-1 py-2 text-sm font-semibold border-red-500 hover:border-gray-400 hover:bg-red-500 hover:text-gray-100 transition-all duration-300 cursor-pointer">Reject</button>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default DeliveryBoyDashboard;
