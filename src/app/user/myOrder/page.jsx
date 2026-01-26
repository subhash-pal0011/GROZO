"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";

const Page = () => {
       const router = useRouter();
       const [loader, setLoader] = useState(true);
       const [order, setOrder] = useState([]);

       useEffect(() => {
              const getOrder = async () => {
                     try {
                            const res = await axios.get("/api/user/myOrder");
                            console.log(res.data)
                            if (res.data.success) {
                                   setOrder(res.data.data);
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
              <div className="relative min-h-screen w-full bg-linear-to-r from-green-100 via-green-100 to-orange-100 p-4 text-gray-700">

                     <button
                            onClick={() => router.push("/")}
                            className="absolute top-4 left-4 flex items-center gap-1"
                     >
                            <IoMdArrowBack size={22} />
                            <span className="text-sm font-semibold">My Order</span>
                     </button>

                     {order.length > 0 ? (
                            <div className="mx-auto space-y-4 max-w-2xl">
                                   {order.map((order) => (
                                          <div
                                                 key={order._id}
                                                 className="bg-linear-to-r from-green-50 via-green-50 to-orange-50 p-4 rounded-lg shadow space-y-3"
                                          >
                                                 <p className="text-center font-semibold">
                                                        {order.orderStatus}
                                                 </p>

                                                 <div className="flex justify-between text-sm">
                                                        <div>
                                                               <p className="font-bold">Order ID: {order._id}</p>
                                                               <p className="">
                                                                      Order Date:{" "}
                                                                      {new Date(order.createdAt).toLocaleDateString("en-IN")},{" "}

                                                                      {new Date(order.createdAt).toLocaleString("en-IN",
                                                                             {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit"
                                                                             })}

                                                               </p>
                                                        </div>
                                                        <div className="flex gap-5">
                                                               <p className="font-semibold">{order.paymentStatus}</p>
                                                               <p className="font-semibold">{order.isPayed ? "paid" : "unpaid"}</p>
                                                        </div>




                                                 </div>
                                                 <div>
                                                        {order?.paymentMethod === "online" ? (
                                                               <div className="flex items-center gap-1">
                                                                      💳
                                                                      <p className="text-xs font-semibold mt-1">Payment Online</p>
                                                               </div>
                                                        )
                                                               :

                                                               <div className="flex items-center gap-1">
                                                                      <img src="/cash.gif" alt="icon" className="h-5 w-5" />
                                                                      <span className="text-xs font-semibold">Cash on Delivery</span>
                                                               </div>
                                                        }
                                                        <div className="px-2">
                                                               <p className="text-xs font-semibold">{order?.address?.fullAddress}</p>

                                                        </div>
                                                 </div>


                                                 {order.items?.map((item, idx) => (
                                                        <div key={idx} className="border p-2 rounded-md space-y-4">
                                                               <div className="flex items-center gap-1">
                                                                      <img
                                                                             src={item?.image}
                                                                             alt={item?.name}
                                                                             className="h-20 w-20 object-cover rounded"
                                                                      />

                                                                      <div className="flex flex-col">
                                                                             <p className="text-xs font-medium">{item?.name}</p>

                                                                             <div className="flex gap-1 text-sm text-gray-600">
                                                                                    <p>{item?.unit}</p>
                                                                                    <p>× {item?.quantity}</p>
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                               <div className="space-y-1">
                                                                      <p className="text-xs font-bold">MRP ₹{item?.price}</p>
                                                                      <p className="text-xs font-bold">Platform Fee ₹5</p>
                                                                      <p className="text-xs font-bold">Delivery Charge ₹40</p>
                                                                      <p className="text-sm font-bold text-green-600">
                                                                             Total Amount ₹{order?.totalAmount}
                                                                      </p>
                                                               </div>
                                                        </div>
                                                 ))}
                                          </div>
                                   ))}
                            </div>
                     ) : (
                            <div className="text-center mt-20 space-y-3">
                                   <p className="text-xl font-semibold text-orange-500">
                                          No Orders Found
                                   </p>
                                   <p className="text-sm font-semibold">
                                          Start shopping to view your orders
                                   </p>
                            </div>
                     )}
              </div>
       );
};

export default Page;



// Total items :
// 1
// Total price :
// 100
// Platform Fee :
// 5
// Dilevery Charge :
// 40
// Total Amount :
// 145
// discount
