"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaBasketShopping } from "react-icons/fa6";
import { MdOutlineDirectionsBike } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";

const MainPage = ({setStep}) => {
       return (
              <motion.div
                     initial={{
                            opacity: 0, scale: 0.95
                     }}
                     animate={{
                            opacity: 1, scale: 1
                     }}
                     transition={{
                            duration: 1.2, ease: "easeOut"
                     }}
                     className="min-h-screen w-full text-center items-center justify-center flex flex-col"
              >
                     <div className="flex items-center">

                            <motion.div
                                   initial={{
                                          x: -40, opacity: 0
                                   }}
                                   animate={{
                                          x: 0, opacity: 1
                                   }}
                                   transition={{
                                          delay: 0.3, duration: 0.8

                                   }}
                            >
                                   <Image
                                          src="/trolleyBag.gif"
                                          alt="Shopping Trolley"
                                          width={84}
                                          height={84}
                                          priority
                                   />
                            </motion.div>

                            <motion.div
                                   initial={{
                                          y: 20, opacity: 0
                                   }}
                                   animate={{
                                          y: 0, opacity: 1
                                   }}
                                   transition={{
                                          delay: 0.6, duration: 0.8
                                   }}
                                   className="inline-block"
                            >
                                   <Image
                                          className="scale-125"
                                          src="/grozo.png"
                                          alt="Grozo Logo"
                                          width={200}
                                          height={200}
                                   />

                            </motion.div>
                     </div>

                     <motion.div
                            initial={{
                                   y: 20, opacity: 0
                            }}
                            animate={{
                                   y: 0, opacity: 1
                            }}
                            transition={{
                                   delay: 1, duration: 1
                            }}
                            className="max-w-127.5 text-sm font-semibold text-gray-300"
                     >
                            Grozo is built to redefine grocery shopping by combining technology, efficiency, and trusted local sourcing to deliver freshness and convenience at scale.
                     </motion.div>

                     <motion.div
                            className="flex gap-20 p-1 mt-8"
                            initial={{
                                   y: 20, opacity: 0,

                            }}
                            animate={{
                                   y: 0, opacity: 1
                            }}
                            transition={{
                                   delay: 0.3, duration: 0.8
                            }}
                     >
                            <FaBasketShopping size={60} className="text-[#109121]" />
                            <MdOutlineDirectionsBike size={60} className="text-amber-600" />
                     </motion.div>
                     <motion.button onClick={()=>setStep(2)}
                            initial={{
                                   y: 20, opacity: 0
                            }}
                            animate={{
                                   y: 0, opacity: 1
                            }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="bg-[#077a16] hover:bg-green-900 text-white font-semibold px-5 py-2 mt-10 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
                     >
                            Next <FiLogIn size={20} />
                     </motion.button>
              </motion.div>
       );
};
export default MainPage;
