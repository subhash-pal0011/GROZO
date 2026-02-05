"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { CiDeliveryTruck, CiLocationOn } from "react-icons/ci";
import { IoSend } from "react-icons/io5";
import { useForm } from "react-hook-form";

import dynamic from "next/dynamic";
import { getSocket } from "@/lib/socket";
const UpdateLocationForDeliveryBoy = dynamic(
       () => import("@/component/UpdateLocationForDeliveryBoy"),
       { ssr: false }
);


const Page = () => {
       const router = useRouter();
       const { orderId } = useParams();
       const [order, setOrder] = useState(null);
       const [userLocation, setUserLocation] = useState(null);
       const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
       const [messages, setMessages] = useState([]);
       const scrollRef = useRef(null)


       const socket = getSocket()
       const {
              register,
              handleSubmit,
              reset,
       } = useForm();

       const userId = order?.user;


       const onSubmit = (data) => {
              const msg = data.message?.trim();
              if (!msg) return;

              const messageObj = {
                     chatId: orderId,
                     senderId: userId,
                     message: msg,
                     time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              };

              socket.emit("send-message", messageObj);
              reset();
       };



       useEffect(() => {
              socket.emit("join-room-chat", orderId);

              socket.on("send-message", (message) => {
                     setMessages((prev) => [...prev, message]);
              });

              return () => socket.off("send-message");
       }, [orderId]);


       useEffect(() => {
              const getAllMessage = async () => {
                     try {
                            const res = await axios.get(`/api/chat/getMsj?chatId=${orderId}`);

                            if (res.data.success) {
                                   setMessages(res.data.data);
                            }
                     } catch (error) {
                            console.log("get message error:", error);
                     }
              };

              if (orderId) getAllMessage(); // orderId exist kare tabhi call
       }, [orderId]);


       useEffect(() => {
              if (!scrollRef.current) return;

              scrollRef.current.scrollTo({
                     top: scrollRef.current.scrollHeight,
                     behavior: "smooth",
              });
       }, [messages]);



       useEffect(() => {
              if (!orderId) return;

              const fetchOrder = async () => {
                     try {
                            const res = await axios.get(`/api/user/getTrackOrder/${orderId}`);

                            if (res.data.success) {
                                   const data = res.data.data;
                                   setOrder(data);

                                   // USER location (map purpose)
                                   setUserLocation({
                                          latitude: data?.address?.latitude,
                                          longitude: data?.address?.longitude,
                                   });

                                   // DELIVERY BOY location (map purpose)
                                   setDeliveryBoyLocation({
                                          longitude:
                                                 data?.orderAssignd?.deliveryBoyId?.location?.coordinates?.[0],
                                          latitude:
                                                 data?.orderAssignd?.deliveryBoyId?.location?.coordinates?.[1],
                                   });
                            }

                     } catch (error) {
                            console.log("Track order error:", error);
                     }
              };

              fetchOrder();
       }, [orderId]);


       const deliveryBoy = order?.orderAssignd?.deliveryBoyId;

       return (
              <div className="min-h-screen w-full bg-linear-to-r from-green-100 via-green-100 to-orange-100 text-gray-700">

                     <div className="flex items-center gap-2 p-4">
                            <button
                                   onClick={() => router.back()}
                                   className="flex items-center gap-1 hover:text-black"
                            >
                                   <IoMdArrowBack size={22} />
                                   <span className="text-sm font-semibold">Back</span>
                            </button>
                     </div>


                     <div className="max-w-2xl mx-auto px-4 space-y-5">
                            <div className="bg-white rounded shadow-lg p-5 space-y-5">

                                   <div>
                                          <p className="text-xs text-gray-500">Order ID</p>
                                          <p className="text-xs font-semibold break-all">{orderId}</p>
                                   </div>

                                   <hr />

                                   <div className="flex items-start gap-3">
                                          <CiLocationOn size={22} className="text-green-600 mt-1" />
                                          <div>
                                                 <p className="text-sm font-semibold">Delivery Address</p>
                                                 <p className="text-xs text-gray-600 capitalize line-clamp-2">
                                                        {order?.address?.fullAddress || "Address not available"}
                                                 </p>
                                          </div>
                                   </div>

                                   <div className="flex items-start gap-3">
                                          <CiDeliveryTruck size={22} className="text-yellow-600 mt-1" />
                                          <div>
                                                 <p className="text-sm font-semibold">Delivery Partner</p>
                                                 {deliveryBoy ? (
                                                        <div className="flex md:flex-row flex-col md:gap-3">
                                                               <p className="text-xs text-gray-600 capitalize line-clamp-1">
                                                                      Name: {deliveryBoy?.name}
                                                               </p>
                                                               <p className="text-xs text-gray-600">
                                                                      Mobile: {deliveryBoy?.mobile}
                                                               </p>
                                                        </div>
                                                 ) : (
                                                        <p className="text-xs text-red-500">
                                                               Delivery partner not assigned yet
                                                        </p>
                                                 )}
                                          </div>
                                   </div>
                            </div>

                            {/* Map placeholder */}
                            <div className="mt-6 bg-white rounded-xl shadow text-center text-sm text-gray-500">
                                   <UpdateLocationForDeliveryBoy
                                          orderLocation={userLocation}
                                          deliveryBoyLocation={deliveryBoyLocation}
                                   />
                            </div>


                            <div className="flex-1 h-80 overflow-y-auto scrollbar-hide p-3 space-y-2 bg-gray-50 rounded-xl" ref={scrollRef}>
                                   {messages.length === 0 && (
                                          <p className="text-center text-sm text-gray-400 mt-4">
                                                 No messages yet
                                          </p>
                                   )}

                                   {messages.map((msg, index) => {
                                          const isMe = msg.senderId === userId;

                                          return (
                                                 <div
                                                        key={index}
                                                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                                 >
                                                        <div
                                                               className={`px-3 py-2 rounded-xl shadow text-sm max-w-[45%] ${isMe
                                                                      ? "bg-green-500 text-white"
                                                                      : "bg-white text-gray-800"
                                                                      }`}
                                                        >
                                                               {msg.message}
                                                               <p
                                                                      className={`text-[10px] mt-1 text-right ${isMe ? "text-green-100" : "text-gray-400"
                                                                             }`}
                                                               >
                                                                      {msg.time}
                                                               </p>
                                                        </div>
                                                 </div>
                                          );
                                   })}
                            </div>

                            <form
                                   onSubmit={handleSubmit(onSubmit)}
                                   className="p-2 border-t flex items-center gap-2"
                            >
                                   <input
                                          type="text"
                                          placeholder="Type message..."
                                          className="flex-1 px-4 py-2 rounded-full border text-sm focus:outline-none focus:ring-1 focus:ring-green-400 text-gray-500"
                                          {...register("message")}
                                   />

                                   <button
                                          type="submit"
                                          className="p-1 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                                   >
                                          <IoSend size={15} />
                                   </button>
                            </form>
                     </div>
              </div>
       );
};

export default Page;
