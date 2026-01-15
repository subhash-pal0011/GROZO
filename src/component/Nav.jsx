"use client"
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";

const Nav = ({ user }) => {
       const [open, setOpen] = useState(false)
       return (
              <nav className="w-full bg-linear-to-r from-green-500 via-green-400 to-orange-500 shadow-md">
                     <div className="max-w-7xl mx-auto px-4">
                            <div className="h-16 flex items-center justify-between">
                                   <Image src="/grozo.png" alt="logo" height={150} width={150} />

                                   <div className="hidden md:block relative w-full max-w-md">
                                          <input
                                                 type="text"
                                                 placeholder="Search for grocery..."
                                                 className="w-full pl-14 pr-4 py-1.5 rounded-full border border-gray-200
                                                 text-gray-700 placeholder-gray-400
                                                 focus:outline-none focus:ring-1 focus:ring-green-100 bg-gray-100 shadow-sm hover:shadow-md transition"
                                          />
                                          <img
                                                 src="/surch-3.gif"
                                                 alt="search icon"
                                                 className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
                                          />
                                   </div>
                                   <div className="flex md:gap-3 gap-2">
                                          <Link href="/cart" className="flex items-center gap-1 relative">
                                                 <Image
                                                        src="/trolleyBag.gif"
                                                        alt="cart"
                                                        height={40}
                                                        width={40}
                                                        className="border border-orange-300 rounded-full p-1"
                                                 />
                                                 <span className="absolute -top-1 -right-1 md:bg-orange-400  md:text-white text-red-500 font-bold text-xs md:h-5 md:w-5 flex items-center justify-center rounded-full">
                                                        0
                                                 </span>
                                          </Link>

                                          <div onClick={() => setOpen(prev => !prev)} className="flex items-center md:px-2">
                                                 {user?.profilePic ? (
                                                        <Image
                                                               src={user?.profilePic}
                                                               alt="user image"
                                                               height={30}
                                                               width={30}
                                                               className="rounded-full object-cover cursor-pointer"
                                                        />
                                                 ) : (
                                                        <img
                                                               src="/avatar.gif"
                                                               alt="default avatar"
                                                               className="h-10 w-10 cursor-pointer rounded-full"
                                                        />
                                                 )}

                                          </div>

                                          {/* YE MOTION KA ANIMATION DENE KE LIYE YE TB USE HOTA JB KOI BUTOON CLIK KRNE PR CARD DIKHE TO USE OPEN AUR EXIST KRTE SMYE YE ANIMATION KRTA HII */}
                                          <AnimatePresence className="absolute top-10">
                                                 {open &&
                                                        <motion.div className="absolute top-15 md:right-20 right-2 bg-gray-100 w-50 p-3 rounded-md space-y-3"
                                                               initial={{
                                                                      opacity: 0,
                                                                      y: -10,
                                                                      scale: 0.95
                                                               }}
                                                               animate={{
                                                                      opacity: 1,
                                                                      y: 1,
                                                                      scale: 1
                                                               }}
                                                               transition={{
                                                                      duration: 0.5
                                                               }}
                                                               exit={{
                                                                      opacity: 0,
                                                                      y: -10,
                                                                      scale: 0.95
                                                               }}
                                                        >
                                                               <div className="text-gray-700 gap-2 flex items-center">
                                                                      {user?.profilePic ? (
                                                                             <Image
                                                                                    src={user?.profilePic}
                                                                                    alt="user image"
                                                                                    height={30}
                                                                                    width={30}
                                                                                    className="rounded-full object-cover cursor-pointer"
                                                                             />
                                                                      ) : (
                                                                             <img
                                                                                    src="/avatar.gif"
                                                                                    alt="default avatar"
                                                                                    className="h-10 w-10 cursor-pointer rounded-full"
                                                                             />
                                                                      )}
                                                                      <span className="p-0 m-0">
                                                                             <p className="text-sm font-semibold m-0 leading-tight">
                                                                                    {user?.name}
                                                                             </p>
                                                                             <p className="text-sm m-0 leading-tight">
                                                                                    user
                                                                             </p>
                                                                      </span>
                                                               </div>
                                                               <div className="flex items-center gap-2 hover:bg-green-100 cursor-pointer p-1">
                                                                      <Image src="/order.gif" alt="icon" height={30} width={30} />
                                                                      <p className="text-sm font-semibold leading-tight text-gray-600">My Order</p>
                                                               </div>

                                                               <div onClick={() =>{
                                                                      setOpen(false)
                                                                      signOut()
                                                                   }}
                                                                     className="flex items-center gap-4      cursor-pointer text-center px-2      hover:bg-red-100 p-2">
                                                                     <AiOutlineLogout color="red" />
                                                                     <p className="text-sm font-semibold      leading-tight text-gray-600">Log Out</p>
                                                               </div>

                                                        </motion.div>
                                                 }
                                          </AnimatePresence>
                                   </div>
                            </div>
                     </div>

                     <div className="md:hidden px-4 pb-4 relative">
                            <input
                                   type="text"
                                   placeholder="Search for grozo..."
                                   className="w-full pl-14 pr-4 py-3 rounded-full border border-gray-200
                                   bg-white text-gray-600 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-green-100
                                   shadow-sm hover:shadow-md transition"
                            />
                            <img
                                   src="/surch-3.gif"
                                   alt="search icon"
                                   className="absolute left-8 top-6 -translate-y-1/2 h-6 w-6 pointer-events-none"
                            />
                     </div>
              </nav>
       );
};

export default Nav;


