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

                            if (res.data.success) {
                                   setOrder(res.data.data);
                                   console.log(res.data)
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
                            <img
                                   src="/loader-1.gif"
                                   alt="Loading..."
                                   className="h-80 w-80 md:h-100 md:w-100"
                            />
                     </div>
              );
       }

       return (
              <div className="relative flex min-h-screen w-full items-center justify-center bg-linear-to-r from-green-100 via-green-100 to-orange-100 text-gray-700">

                     <button
                            onClick={() => router.push("/")}
                            className="absolute top-4 left-4 flex items-center gap-1 cursor-pointer"
                     >
                            <IoMdArrowBack size={22} />
                            <span className="text-sm font-semibold">My Order</span>
                     </button>

                     {order ?
                            <div className="space-y-4 w-2xl">
                                   {order.map((order) => (
                                          <div key={order?._id} className="w-full bg-linear-to-r from-green-50 via-green-50 to-orange-50 p-4 rounded-lg shadow">
                                                 <h3 className="text-sm font-bold mb-2">
                                                        Order ID: {order._id}
                                                 </h3>
                                                 <p>sdfgdg</p>

                                                 {order.items.map((item, itemIndex) => (
                                                        <div
                                                               key={itemIndex}
                                                               className="border p-2 mb-2 rounded flex justify-between"
                                                        >
                                                               <div>
                                                                      <p className="text-sm font-semibold">
                                                                             {item.name}
                                                                      </p>
                                                                      <p className="text-xs text-gray-500">
                                                                             Qty: {item.quantity}
                                                                      </p>
                                                               </div>


                                                               <p className="text-sm font-semibold">
                                                                      ₹{item.price}
                                                               </p>
                                                        </div>
                                                 ))}
                                          </div>
                                   ))}
                            </div>


                            :
                            <div className="text-center space-y-3">
                                   <p className="text-xl font-semibold text-orange-500">No Orders Found</p>
                                   <p className="text-sm font-semibold">Start Shoping to view your Orders here</p>

                                   <button
                                          className="flex items-center justify-center  w-full cursor-pointer rounded  shadow hover:shadow-none transition-all duration-300 shadow-blue-100 hover:border hover:border-orange-500 "
                                   >
                                          <span className="flex items-center gap-1">
                                                 <p className="text-sm font-semibold">Select Item</p>
                                                 <img src="/next.gif" alt="icon" className="h-8 w-8 mt-1" />
                                          </span>
                                   </button>
                            </div>
                     }

              </div>
       );
};
export default Page;
