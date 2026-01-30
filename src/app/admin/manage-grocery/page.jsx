"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

const Page = () => {
       const router = useRouter();
       const [orders, setOrders] = useState([]);
       const [loading, setLoading] = useState(true);
       const [openOrderId, setOpenOrderId] = useState(null);

       const handleStatusChange = async (orderId, status) => {
              try {
                     const res = await axios.post(`/api/admin/updateOrderStatus/${orderId}`,{ status });
                     setOrders(prev =>
                            prev.map(order => order._id === orderId ? {...order, orderStatus:status} : order)
                     );
                     toast.success(res.data?.message || "Updated");
              } catch (error) {
                     console.error("Status update error:", error.response?.data || error);
                     toast.error("Status update failed");
              }
       };


       useEffect(() => {
              const getOrders = async () => {
                     try {
                            const res = await axios.get("/api/admin/getOrder");
                            if (res.data.success) {
                                   setOrders(res.data.data);
                            }
                     } catch (error) {
                            console.error("Get order error:", error);
                     } finally {
                            setLoading(false);
                     }
              };

              getOrders();
       }, []);

       if (loading) {
              return (
                     <div className="min-h-screen flex items-center justify-center">
                            <img
                                   src="/loader-1.gif"
                                   alt="Loading..."
                                   className="h-80 w-80"
                            />
                     </div>
              );
       }

       return (
              <div className="w-full bg-linear-to-r from-green-100 via-green-100 to-orange-100 min-h-screen md:p-4 p-2 pt-16 text-gray-800">

                     <button
                            onClick={() => router.push("/")}
                            className="fixed top-4 left-4 z-10 flex items-center gap-1 text-gray-400 hover:text-green-500 cursor-pointer transition-all duration-300"
                     >
                            <IoMdArrowBack size={22} />
                            <span className="text-sm font-semibold">Back</span>
                     </button>

                     <div className="flex flex-col items-center justify-center w-full">
                            {orders.length === 0 ? (
                                   <div className="text-center text-gray-500 py-20 flex flex-col items-center">
                                          <img src="/noOrder.gif" className="h-24 w-24 mb-3" />
                                          <p className="text-base font-semibold text-gray-700">
                                                 No Orders Found
                                          </p>
                                          <p className="text-sm mt-1 max-w-xs">
                                                 Orders will appear here once customers start placing them.
                                          </p>
                                   </div>
                            ) : (
                                   <div className="mt-10 w-full max-w-xl space-y-4">
                                          {orders.map((order) => {
                                                 const isOpen = openOrderId === order._id;
                                                 return (
                                                        <div
                                                               key={order._id}
                                                               className="bg-linear-to-r from-blue-100 via-green-100 to-orange-100 border rounded shadow-sm p-5 hover:shadow-md transition space-y-2 relative"
                                                        >
                                                               <div className="md:flex justify-between">
                                                                      <p className="hidden lg:flex items-center gap-1 text-sm font-semibold">
                                                                             <img src="/orderId.gif" alt="Order ID" className="h-5 w-5" />
                                                                             Order ID:{" "}
                                                                             <span className="text-gray-600">
                                                                                    {order?._id}
                                                                             </span>
                                                                      </p>

                                                                      <p className="flex lg:hidden text-sm font-semibold">
                                                                             <img src="/orderId.gif" alt="Order ID" className="h-5 w-5" />
                                                                             Order ID:{" "}
                                                                             <span className="text-gray-600">
                                                                                    {order?._id?.slice(-5)}
                                                                             </span>
                                                                      </p>

                                                                      <div className="flex gap-4 p-1 text-gray-600">
                                                                             <p className="text-sm font-semibold">{order?.paymentStatus}</p>
                                                                             {order?.isPayed ? <p className="text-sm font-semibold">Paid</p> : <p className="text-sm font-semibold">UnPaid</p>}
                                                                      </div>

                                                                      <select value={order.orderStatus}
                                                                             onChange={(e) => handleStatusChange(order._id, e.target.value)
                                                                             } className="border border-gray-400 p-1 text-xs focus:outline-none cursor-pointer font-bold text-gray-600">
                                                                             <option value="placed">Placed</option>
                                                                             <option value="confirmed">Confirm</option>
                                                                             <option value="delivered">Delivered</option>
                                                                             <option value="cancelled">cancel</option>
                                                                      </select>
                                                               </div>

                                                               <div className="flex items-center gap-1 font-semibold text-xs text-gray-600">
                                                                      <img src="/noOrder.gif" className="h-5 w-5" />
                                                                      <p>{new Date(order.createdAt).toLocaleDateString("en-IN")}</p> {","}
                                                                      <p>{new Date(order.createdAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                                                               </div>

                                                               <div className="md:flex gap-2 ">
                                                                      <div className="flex items-center text-xs font-semibold text-gray-600 gap-1">
                                                                             <img src="/name.gif" className="h-5 w-5" />
                                                                             <p className="capitalize line-clamp-1">{order?.address?.name}</p>
                                                                      </div>
                                                                      <div className="items-center flex text-xs gap-1 md:mt-0 mt-2">
                                                                             <img src="/mobile.gif" className="h-5 w-5" />
                                                                             <p>{order?.address?.mobile}</p>
                                                                      </div>
                                                               </div>

                                                               <div className="flex">
                                                                      <img src="/location.gif" className="h-6 w-6" />
                                                                      <p className="capitalize line-clamp-2 font-semibold text-sm text-gray-700">{order?.address?.fullAddress}</p>
                                                               </div>

                                                               <div className="px-1">
                                                                      {order?.paymentMethod === "online" ?
                                                                             <>💳 <span>{order?.paymentMethod}</span></>
                                                                             :
                                                                             <div className="flex items-center gap-1">
                                                                                    <img src="/cash.gif" className="h-5 w-5" />
                                                                                    <span>{order?.paymentMethod}</span>
                                                                             </div>
                                                                      }
                                                               </div>


                                                               <button
                                                                      onClick={() =>
                                                                             setOpenOrderId((prevId) => (prevId === order._id ? null : order._id))
                                                                      }
                                                                      className="absolute right-8 md:top-35 top-60 text-blue-500 cursor-pointer"
                                                               >
                                                                      {isOpen ? <IoChevronUpSharp size={22} /> : <IoChevronDownSharp size={22} />}
                                                               </button>

                                                               <AnimatePresence initial={false}>
                                                                      {isOpen && (
                                                                             <motion.div
                                                                                    initial={{ opacity: 0, scaleY: 0 }}
                                                                                    animate={{ opacity: 1, scaleY: 1 }}
                                                                                    exit={{ opacity: 0, scaleY: 0 }}
                                                                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                                                                    className="origin-top overflow-hidden border p-2 rounded space-y-3 shadow mt-3"
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

                                                                                    <div className="space-y-1 p-2 rounded">
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
                                                 )
                                          })}
                                   </div>
                            )}
                     </div>
              </div>
       );
};
export default Page;
