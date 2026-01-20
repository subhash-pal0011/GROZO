"use client";

import Image from "next/image";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoAdd } from "react-icons/io5";
import { MdRemove } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { addCartData, removeCartData } from "@/redux/cartSlice";

const ItemCard = ({ data }) => {
       if (!data) return null;

       const dispatch = useDispatch();
       const { cartData } = useSelector((state) => state.card);

       const cartItem = cartData.find((i) => i._id === data._id);

       return (
              <motion.div
                     initial={{
                            opacity: 0, y: 50, scale: 0.5
                     }}
                     whileInView={{ // 🔁 YE PROPERT HOTI HII JB SCROOL PR ANIMATE KRNA HO ELEMNT KO TO.
                            opacity: 1, y: 0, scale: 1
                     }}
                     transition={{
                            duration: 0.3, ease: "easeOut"
                     }}
                     viewport={{
                            // true kr doge to ek hi bar dikhega animate hote false kr doge jitni bar scroll kroge utni bar animate  hote dikhega.
                            once: false,

                            // HUM ISKO BATA SKTE HII KI PAGE ITNA DIKHNE LGE TO PAGE KO DIKHAO.
                            amount: 0.1
                     }}
                     className="group bg-linear-to-r from-green-50 via-green-50 to-orange-50 
                     rounded-2xl shadow-sm hover:shadow-lg shadow-orange-200 
                     transition-all duration-300 p-4 flex flex-col gap-3"
              >
                     <div className="relative w-full h-36 flex items-center justify-center rounded-xl">
                            <Image
                                   src={data.image}
                                   alt={data.name}
                                   fill
                                   className="object-contain p-2 group-hover:scale-105 transition-transform"
                            />
                     </div>


                     <div className="flex flex-col">
                            <h3 className="font-semibold text-gray-900 capitalize line-clamp-1">
                                   {data.name}
                            </h3>

                            <p className="text-sm text-gray-500 capitalize">
                                   {data.unit} • {data.types}
                            </p>

                            <div className="flex md:flex-row flex-col items-center justify-between mt-2">
                                   <span className="text-lg font-bold text-green-700">
                                          ₹ {data.price}
                                   </span>

                                   <AnimatePresence mode="wait">
                                          {!cartItem ? (
                                                 <motion.button
                                                        key="add"
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: 20, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        onClick={() => dispatch(addCartData(data))}
                                                        className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 cursor-pointer" 
                                                 >
                                                        <IoAdd /> Add
                                                 </motion.button>
                                          ) : (
                                                 <motion.div
                                                        key="qty"
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: 20, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="flex items-center gap-3 bg-green-600 text-white px-3 py-1 rounded"
                                                 >
                                                        <button onClick={() => dispatch(removeCartData(data._id))} className="cursor-pointer">
                                                               <MdRemove />
                                                        </button>

                                                        <span>{cartItem.qty}</span>

                                                        <button className="cursor-pointer"
                                                               onClick={() => dispatch(addCartData(data))}>
                                                               <IoAdd />
                                                        </button>
                                                 </motion.div>
                                          )}
                                   </AnimatePresence>
                            </div>
                     </div>
              </motion.div>
       );
};

export default ItemCard;



