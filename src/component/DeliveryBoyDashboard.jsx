"use client";
import { getSocket } from "@/lib/socket";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import dynamic from "next/dynamic";
import MessageForDelivery from "./MessageForDelivery";
const UpdateLocationForDeliveryBoy = dynamic(
  () => import("./UpdateLocationForDeliveryBoy"),
  { ssr: false }
);


const DeliveryBoyDashboard = () => {
  const [data, setData] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderLocation, setOrderLocation] = useState(null);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // const userId = session?.user?.id
  console.log(userId)



  useEffect(() => {
    const getOrderNotification = async () => {
      const res = await axios.get("/api/delivery/getDeliveryAssignment");
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

  // ACCEPT ORDER BUTTON
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



  // ACCEPT KRNE KE BAD USER(jo order kiya hii) KA DATA
  useEffect(() => {
    const fetchAcceptedOrder = async () => {
      const res = await axios.get("/api/delivery/getAcceptOrder");
      if (res.data.success && res.data.data) {
        setActiveOrder(res.data.data);
      }
    };
    fetchAcceptedOrder();
  }, []);

  useEffect(() => {
    if (activeOrder?.orderId?.address) {
      setOrderLocation({
        latitude: activeOrder.orderId.address.latitude,
        longitude: activeOrder.orderId.address.longitude,
      });
    }
  }, [activeOrder]);


  //LIVE LOCATION (ONLY AFTER ACCEPT)
  useEffect(() => {  // YE DEGA LIVE LOCATION DELIVERY BOY KI.
    const socket = getSocket();

    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        setDeliveryBoyLocation({ latitude, longitude });

        socket.emit("update-location", {
          userId,
          location: {
            type: "Point",
            coordinates: [longitude, latitude], // 🧠 PAHLE longitude KYUKI JB STATUS CONFERM KROGE TO TUMHRE ORDER SE JITNE 10KM MEA DELIVERY BOY RHENGE UNKE PASS NOTIFICATION JYEGA ORDER PUCHANE KE LIYE 
          },
        });
      },
      (error) => {
        console.log("Location error:", error);
      },
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);


  if (activeOrder && orderLocation) {
    return (
      <div className="min-h-screen p-2 bg-linear-to-r from-green-100 via-green-100 to-orange-100">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">

          {/* MAP */}
          <div className="w-full md:w-1/2">
            <div className="p-2 shadow-2xl bg-white rounded-xl ">
              <h1 className="text-center text-green-500 text-lg font-semibold mb-2">
                Active Order
              </h1>

              <UpdateLocationForDeliveryBoy
                orderLocation={orderLocation}
                deliveryBoyLocation={deliveryBoyLocation}
              />
            </div>
          </div>

          {/* CHAT */}
          <div className="w-full md:w-1/2">
            <MessageForDelivery
              orderId={activeOrder?.orderId?._id}
              deliveryBoyId={userId}
            />
          </div>

        </div>
      </div>

    );
  }

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