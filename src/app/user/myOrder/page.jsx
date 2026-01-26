"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

const Page = () => {
       const router = useRouter();
       const [loader, setLoader] = useState(true);
       const [orders, setOrders] = useState([]);
       const [openOrderId, setOpenOrderId] = useState(null);

       useEffect(() => {
              const getOrder = async () => {
                     try {
                            const res = await axios.get("/api/user/myOrder");
                            if (res.data.success) {
                                   setOrders(res.data.data);
                            }
                     } catch (error) {
                            console.error("Get order error:", error);
                     } finally {
                            setLoader(false);
                     }
              };
              getOrder();
       }, []);

       if (loader) {
              return (
                     <div className="flex items-center justify-center h-screen">
                            <img src="/loader-1.gif" alt="Loading..." className="h-80 w-80" />
                     </div>
              );
       }

       return (
              <div className="relative min-h-screen w-full bg-linear-to-r from-green-50 via-green-100 to-orange-50 p-4 text-gray-700">

                     <button
                            onClick={() => router.push("/")}
                            className="absolute top-4 left-4 flex items-center gap-1"
                     >
                            <IoMdArrowBack size={22} />
                            <span className="text-sm font-semibold">My Order</span>
                     </button>

                     {orders.length > 0 ? (
                            <div className="mx-auto space-y-4 max-w-2xl mt-20">
                                   {orders.map((order) => {
                                          const isOpen = openOrderId === order._id;

                                          return (
                                                 <div
                                                        key={order._id}
                                                        className="bg-linear-to-r from-green-50 via-green-50 to-orange-50 p-4 rounded-lg shadow space-y-3 relative"
                                                 >
                                                        <p className="text-center font-semibold">{order.orderStatus}</p>

                                                        <div className="flex gap-5 sm:hidden">
                                                               <p className="font-semibold capitalize">{order.paymentStatus}</p>
                                                               <p className={`font-semibold ${order.isPayed ? "text-green-600" : "text-red-500"}`}>
                                                                      {order.isPayed ? "Paid" : "Unpaid"}
                                                               </p>
                                                        </div>

                                                        <div className="flex justify-between text-sm">
                                                               <div>
                                                                      <p className="font-bold">
                                                                             Order ID:
                                                                             <span className="sm:hidden">#{order?._id?.slice(-2)}</span>
                                                                             <span className="hidden sm:inline">{order?._id}</span>
                                                                      </p>
                                                                      <p>
                                                                             Order Date:{" "}
                                                                             {new Date(order.createdAt).toLocaleDateString("en-IN")},{" "}
                                                                             {new Date(order.createdAt).toLocaleString("en-IN", {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                             })}
                                                                      </p>
                                                               </div>

                                                               <div className="hidden md:flex gap-5">
                                                                      <p className="font-semibold">{order.paymentStatus}</p>
                                                                      <p className={`font-semibold ${order.isPayed ? "text-green-600" : "text-red-500"}`}>
                                                                             {order.isPayed ? "Paid" : "Unpaid"}
                                                                      </p>
                                                               </div>
                                                        </div>

                                                        <div>
                                                               {order?.paymentMethod === "online" ? (
                                                                      <div className="flex items-center gap-1">
                                                                             💳
                                                                             <p className="text-xs font-semibold mt-1 capitalize line-clamp-1">
                                                                                    Payment Online
                                                                             </p>
                                                                      </div>
                                                               ) : (
                                                                      <div className="flex items-center gap-1">
                                                                             <img src="/cash.gif" alt="icon" className="h-5 w-5" />
                                                                             <span className="text-xs capitalize line-clamp-1 font-semibold">
                                                                                    Cash on Delivery
                                                                             </span>
                                                                      </div>
                                                               )}

                                                               <div className="flex items-center p-0.5">
                                                                      <img src="/location-2.gif" alt="icon" className="h-5 w-5" />
                                                                      <p className="text-xs font-semibold capitalize line-clamp-2">
                                                                             {order?.address?.fullAddress}
                                                                      </p>
                                                               </div>
                                                        </div>

                                                        <button
                                                               onClick={() =>
                                                                      setOpenOrderId((prevId) => (prevId === order._id ? null : order._id))
                                                               }
                                                               className="absolute right-8 top-8 text-blue-500 cursor-pointer"
                                                        >
                                                               {isOpen ? <IoChevronUpSharp size={22} /> : <IoChevronDownSharp size={22} />}
                                                        </button>

                                                        <AnimatePresence>
                                                               {isOpen && (
                                                                      <motion.div
                                                                             initial={{ height: 0, opacity: 0, y: 50 }}
                                                                             animate={{ height: "auto", opacity: 1, y: 0 }}
                                                                             exit={{ height: 0, opacity: 0, y: 50 }}
                                                                             transition={{ duration: 0.5, ease: "easeInOut" }}
                                                                             className="border p-2 rounded space-y-3 shadow scrollbar-hide mt-3"
                                                                      >

                                                                             {order.items?.map((item, idx) => (
                                                                                    <div key={idx} className="flex flex-col space-y-2">
                                                                                           <div className="flex items-center gap-2 p-2">
                                                                                                  <img src={item.image} className="h-15 w-15 rounded" />
                                                                                                  <div>
                                                                                                         <p className="text-xs font-medium capitalize line-clamp-1">
                                                                                                                {item?.name}
                                                                                                         </p>
                                                                                                         <p className="text-xs text-gray-600">
                                                                                                                {item.unit} × {item.quantity}
                                                                                                         </p>
                                                                                                         <p className="text-xs font-bold">MRP ₹{item.price}</p>
                                                                                                  </div>
                                                                                           </div>
                                                                                           <hr />
                                                                                    </div>
                                                                             ))}

                                                                             <div className="space-y-1 p-2 bg-gray-50 rounded">
                                                                                    <p className="text-md font-semibold">Bill details</p>

                                                                                    <p className="text-xs font-bold">
                                                                                           Platform Fee ₹{order?.priceDetails?.platformFee}
                                                                                    </p>

                                                                                    <p className="text-xs font-bold">
                                                                                           Delivery Charge ₹{order?.priceDetails?.deliveryCharge}
                                                                                    </p>

                                                                                    {Number(order?.priceDetails?.discount) > 0 && (
                                                                                           <p className="text-xs font-bold text-green-600">
                                                                                                  Discount −₹{order.priceDetails.discount}
                                                                                           </p>
                                                                                    )}

                                                                                    <hr className="my-2" />

                                                                                    <p className="text-sm font-bold text-green-700">
                                                                                           Total Amount ₹{order?.priceDetails?.totalAmount}
                                                                                    </p>
                                                                             </div>
                                                                      </motion.div>
                                                               )}
                                                        </AnimatePresence>
                                                 </div>
                                          );
                                   })}
                            </div>
                     ) : (
                            <div className="text-center mt-20 space-y-3">
                                   <p className="text-xl font-semibold text-orange-500">No Orders Found</p>
                                   <p className="text-sm font-semibold">Start shopping to view your orders</p>
                            </div>
                     )}
              </div>
       );
};

export default Page;