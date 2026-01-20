"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { GiFruitBowl, GiBroccoli } from "react-icons/gi";
import { LuMilk } from "react-icons/lu";
import { FaBirthdayCake, FaSeedling, FaLeaf } from "react-icons/fa";
import { PiPopcornLight, PiGrainsLight } from "react-icons/pi";
import { GiChiliPepper, GiCookingPot } from "react-icons/gi";
import { GiFishEscape, GiSnowflake1, GiNoodles } from "react-icons/gi";
import { GiBroom } from "react-icons/gi";
import { MdElectricalServices } from "react-icons/md";
import { FaBaby } from "react-icons/fa6";

const TypesProduct = () => {
       const scrollRef = useRef(null);

       const [leftShowBtn, setLeftShowBtn] = useState(false)
       const [rightShowBtn, setRightShowBtn] = useState(false)

       const types = [
              { id: 1, name: "fruits", icon: <GiFruitBowl /> },
              { id: 2, name: "vegetables", icon: <GiBroccoli /> },
              { id: 3, name: "dairy", icon: <LuMilk /> },
              { id: 4, name: "bakery", icon: <FaBirthdayCake /> },
              { id: 5, name: "snacks", icon: <PiPopcornLight /> },
              { id: 6, name: "grains", icon: <PiGrainsLight /> },
              { id: 7, name: "pulses", icon: <FaSeedling /> },
              { id: 8, name: "spices", icon: <GiChiliPepper /> },
              { id: 9, name: "oils", icon: <GiCookingPot /> },
              { id: 10, name: "seafood", icon: <GiFishEscape /> },
              { id: 11, name: "frozen_food", icon: <GiSnowflake1 /> },
              { id: 12, name: "instant_food", icon: <GiNoodles /> },
              { id: 13, name: "organic", icon: <FaLeaf /> },
              { id: 14, name: "personal_care", icon: <FaLeaf /> },
              { id: 15, name: "baby_care", icon: <FaBaby /> },
              { id: 16, name: "household", icon: <GiBroom /> },
              { id: 17, name: "electric", icon: <MdElectricalServices /> },
       ];

       const scroll = (direction) => {

              if (scrollRef.current) {
                     scrollRef.current.scrollBy({
                            left: direction === "left" ? -260 : 260,
                            behavior: "smooth",
                     });
              }
       };
       const checkScroll = () => {
              if (!scrollRef.current) return;
              const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

              setLeftShowBtn(scrollLeft > 0) // leftShowBtn ISE TBHI TRUE KRNA JB O SE BADA HO.
              setRightShowBtn(scrollLeft + clientWidth < scrollWidth) // rightShowBtn ISE TBHI TRUE KRNA JB IN DONO KO scrollLeft + clientWidth ADD KRNE PR  scrollWidth SE BADA HO.

              // console.log(scrollLeft)
              // console.log(scrollWidth) // ISKO SMJH NE KE LIYE SCROLL RIGHT SMJH SKTE HII.
              // console.log(clientWidth)
       };


       useEffect(() => {
              if (!scrollRef.current) return
              scrollRef.current?.addEventListener("scroll", checkScroll)

              const time = setInterval(() => { // AUTO SCROLL
                     const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                     if (scrollLeft + clientWidth >= scrollWidth) {
                            scrollRef.current.scrollTo({
                                   left: 0, // 🧠 mtlb left 0 se strt kro
                                   behavior: "smooth",
                            })
                     }
                     else {
                            scrollRef.current.scrollBy({
                                   left: 260,// 🧠 ek baar me left se 260px right ki taraf scroll kar do
                                   behavior: "smooth",
                            })
                     }
              }, 3000);
              checkScroll()
              return () => {
                     clearInterval(time);
                     scrollRef.current?.removeEventListener("scroll", checkScroll) // remove bhi krna rhta hii is liye.
              }
       }, [])

       return (
              <motion.div
                     initial={{
                            opacity: 0, y: 50, scale: 0.1
                     }}
                     whileInView={{ // 🔁 YE PROPERT HOTI HII JB SCROOL PR ANIMATE KRNA HO ELEMNT KO TO.
                            opacity: 1, y: 0, scale: 1
                     }}
                     transition={{
                            duration: 0.6, ease: "easeOut"
                     }}
                     viewport={{
                            // true kr doge to ek hi bar dikhega animate hote false kr doge jitni bar scroll kroge utni bar animate  hote dikhega.
                            once: false,

                            amount: 0.1  // HUM ISKO BATA SKTE HII KI PAGE ITNA DIKHNE LGE TO PAGE KO DIKHAO.
                     }}

                     className="w-full relative items-center text-center py-2  bg-linear-to-r from-green-50 via-green-50 to-orange-50 rounded-sm">

                     {leftShowBtn &&
                            <div
                                   className="absolute top-1/2 left-2 -translate-y-1/2  text-white rounded-full p-2 cursor-pointer z-10 bg-gray-800"
                                   onClick={() => scroll("left")}
                            >
                                   <IoChevronBack size={24} />
                            </div>
                     }

                     <div className="flex items-center justify-center gap-1">
                            <img src="/trolly.gif" alt="icon" className="h-12" />
                            <h2 className="text-2xl font-semibold text-gray-600">Shop by Types</h2>
                     </div>
                     <div
                            ref={scrollRef}
                            className="flex gap-4 overflow-x-auto scrollbar-hide py-4 p-1"
                     >
                            {types.map((item) => (
                                   <div
                                          key={item.id}
                                          className="min-w-25 flex flex-col items-center gap-2 p-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition cursor-pointer"
                                   >
                                          <div className="text-3xl text-orange-400">{item.icon}</div>
                                          <p className="text-sm capitalize text-center">{item.name}</p>
                                   </div>
                            ))}
                     </div>

                     {/* Right Arrow */}
                     {rightShowBtn &&
                            <div
                                   className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 cursor-pointer z-10"
                                   onClick={() => scroll("right")}
                            >
                                   <IoChevronForwardOutline size={24} />
                            </div>
                     }
              </motion.div>
       );
};

export default TypesProduct;



