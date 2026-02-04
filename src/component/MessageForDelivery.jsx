"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { getSocket } from "@/lib/socket";
import axios from "axios";

const MessageForDelivery = ({ orderId, deliveryBoyId }) => {

       const scrollRef = useRef(null)

       const {
              register,
              handleSubmit,
              reset,
       } = useForm();

       const [messages, setMessages] = useState([]);

       const socket = getSocket()
       useEffect(() => {
              if (!orderId) return;
              socket.emit("join-room-chat", orderId);
       }, [orderId]);

       useEffect(() => {
              socket.on("send-message", (message) => {
                     setMessages((prev) => [...prev, message]);
              });

              return () => socket.off("send-message");
       }, []);


       useEffect(() => {
              if (!scrollRef.current) return;

              scrollRef.current.scrollTo({
                     top: scrollRef.current.scrollHeight,
                     behavior: "smooth",
              });
       }, [messages])


       const onSubmit = (data) => {
              const msg = data.message?.trim();
              if (!msg) return;

              socket.emit("send-message", {
                     chatId: orderId,
                     senderId: deliveryBoyId,
                     message: msg,
                     roomId: orderId,
                     time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", })
              });

              reset();
       };

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





       return (
              <div className="w-full md:h-150 h-80 bg-white rounded-2xl shadow-xl flex flex-col">

                     {/* MESSAGES */}
                     <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-2 bg-gray-50 rounded-xl">
                            {messages.length === 0 && (
                                   <p className="text-center text-sm text-gray-400 mt-4">
                                          No messages yet
                                   </p>
                            )}

                            {messages.map((msg, index) => {
                                   const isMe = msg.senderId === deliveryBoyId;

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
       );
};

export default MessageForDelivery;
