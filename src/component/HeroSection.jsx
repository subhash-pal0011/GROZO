"use client";
import React, { useEffect, useState } from "react";
import { GiLindenLeaf } from "react-icons/gi";
import { FaTruckFast } from "react-icons/fa6";
import { MdOutlineLocalOffer } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const HeroSection = () => {
       const slides = [
              {
                     id: 1,
                     icon: <GiLindenLeaf className="text-green-500 text-5xl" />,
                     title: "Fresh Organic Groceries🫑🍄🥑",

                     subtitle:
                            "Farm-fresh fruits, vegetables and daily essentials delivered to you",
                     btnText: "Shop Now",
                     bg: "https://plus.unsplash.com/premium_photo-1726869818459-061e0986c1a1?q=80&w=1160&auto=format&fit=crop",
              },
              {
                     id: 2,
                     icon: <FaTruckFast className="text-orange-500 text-5xl" />,
                     title: "Fast & Safe Delivery 🚚",
                     subtitle: "Get your groceries delivered at your doorstep in no time",
                     btnText: "Order Now",
                     bg: "https://plus.unsplash.com/premium_photo-1678283974882-a00a67c542a9?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
              {
                     id: 3,
                     icon: <MdOutlineLocalOffer className="text-red-500 text-5xl" />,
                     title: "Best Deals & Offers 💸",
                     subtitle: "Save more with exciting discounts on daily essentials",
                     btnText: "Grab Deals",
                     bg: "https://plus.unsplash.com/premium_photo-1672883552013-506440b2f11c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
       ];

       const [current, setCurrent] = useState(0);
       const totalSlides = slides.length;
       const [isHovered, setIsHovered] = useState(false);


       useEffect(() => {
              if (isHovered) return; // hover pe slide stop
              const interval = setInterval(() => {
                     setCurrent((prev) => (prev + 1) % totalSlides);
              }, 5000);

              return () => clearInterval(interval);
       }, [isHovered, totalSlides]);

       return (
              <div
                     className="w-full h-[80vh] relative overflow-hidden"
                     onMouseEnter={() => setIsHovered(true)}
                     onMouseLeave={() => setIsHovered(false)}
              >
                     <AnimatePresence mode="wait">
                            <motion.div
                                   key={slides[current].id}
                                   initial={{ opacity: 0, scale: 1.05 }}
                                   animate={{ opacity: 1, scale: 1 }}
                                   exit={{ opacity: 0 }}
                                   transition={{ duration: 0.8 }}
                                   className="absolute inset-0 bg-cover bg-center"
                            >
                                   <Image
                                          src={slides[current].bg}
                                          alt="hero-bg"
                                          fill
                                          priority
                                          className="object-cover"
                                   />

                                   <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                                          <motion.div
                                                 initial={{ y: 40, opacity: 0 }}
                                                 animate={{ y: 0, opacity: 1 }}
                                                 transition={{ delay: 0.3 }}
                                                 className="max-w-2xl text-white"
                                          >
                                                 <div className="flex justify-center mb-4">
                                                        {slides[current].icon}
                                                 </div>

                                                 <h1 className="text-3xl md:text-5xl font-bold mb-4">
                                                        {slides[current].title}
                                                 </h1>

                                                 <p className="text-sm md:text-lg text-gray-200 mb-6">
                                                        {slides[current].subtitle}
                                                 </p>

                                                 <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-full text-white font-semibold transition cursor-pointer">
                                                        {slides[current].btnText}
                                                 </button>
                                          </motion.div>
                                   </div>
                            </motion.div>
                     </AnimatePresence>

                     <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                            {slides.map((_, index) => (
                                   <motion.button
                                   initial={{
                                          y:40, opacity:0
                                   }}
                                   animate={{
                                          y:0, opacity:1
                                   }}
                                   transition={{
                                          display:0.3
                                   }}
                                          key={index}
                                          onClick={() => setCurrent(index)}
                                          className={`h-3 w-3 rounded-full transition-all duration-300
                                          ${current === index ? "bg-orange-500 w-6" : "bg-white/60 hover:bg-white"} `}
                                   />
                            ))}
                     </div>

              </div>
       );
};

export default HeroSection;

