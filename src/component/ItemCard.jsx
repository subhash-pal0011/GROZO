"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { IoAdd } from "react-icons/io5";

const ItemCard = ({ data }) => {
       if (!data) return null;

       return (
              <motion.div
                     initial={{
                            opacity: 0, y: 50, scale: 0.5
                     }}
                     whileInView={{ // 🔁 YE PROPERT HOTI HII JB SCROOL PR ANIMATE KRNA HO ELEMNT KO TO.
                            opacity: 1, y: 0, scale: 1
                     }}
                     transition={{
                            duration: 0.2, ease: "easeOut"
                     }}
                     viewport={{
                            // true kr doge to ek hi bar dikhega animate hote false kr doge jitni bar scroll kroge utni bar animate  hote dikhega.
                            once: false,

                            amount: 0.1  // HUM ISKO BATA SKTE HII KI PAGE ITNA DIKHNE LGE TO PAGE KO DIKHAO.
                     }}
                     className="group bg-linear-to-r from-green-50 via-green-50 to-orange-50 rounded-2xl shadow-sm hover:shadow-lg shadow-orange-200 transition-all duration-300 p-4 flex flex-col gap-3">

                     <div className="relative w-full h-36 flex items-center justify-center rounded-xl">
                            <Image
                                   src={data.image}
                                   alt={data.name}
                                   fill
                                   className="object-contain p-2 group-hover:scale-105 transition-transform"
                            />
                     </div>

                     <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-gray-900 capitalize line-clamp-1">
                                   {data.name}
                            </h3>

                            <p className="text-sm text-gray-500 capitalize">
                                   {data.unit} • {data.types}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                                   <span className="md:text-lg text-md font-bold text-green-700">
                                          ₹ {data.price}
                                   </span>

                                   <motion.button
                                          whileHover={{
                                                 scale: 1.05
                                          }}
                                          whileTap={{
                                                 scale: 0.9
                                          }}
                                          transition={{
                                                 type: "spring",
                                                 stiffness: 400,
                                                 damping: 10
                                          }}
                                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                                   >
                                          <IoAdd size={16} />
                                          Add
                                   </motion.button>

                            </div>
                     </div>
              </motion.div>
       );
};

export default ItemCard;
