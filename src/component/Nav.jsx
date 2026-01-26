"use client"
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaStreetView } from "react-icons/fa6";
import { MdOutlineManageAccounts } from "react-icons/md";
import { createPortal } from "react-dom";
import { FaBars } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { FaAnglesDown } from "react-icons/fa6";
import axios from "axios";
import { toast } from "sonner";
import { setSelectedAddress } from "@/redux/addressSlice";
import { useRouter } from "next/navigation";

const Nav = ({ user }) => {
       const [open, setOpen] = useState(false)
       const router = useRouter()

       const [menuOpen, setMenuOpen] = useState()

       const [locationOpen, setLocationOpen] = useState(false)

       const { cartData } = useSelector((state) => state.card)

       const [addresses, setAddresses] = useState([]);

       const dispatch = useDispatch()


       useEffect(() => {
              if (!user?._id) return;
              const fetchAddress = async () => {
                     try {
                            const res = await axios.get(
                                   `/api/user/getAddress?userId=${user._id}`
                            );
                            if (res.data.success) {
                                   setAddresses(res.data.data);
                            }
                     } catch (err) {
                            console.log("address fetch error", err);
                     }
              };
              fetchAddress();
       }, [user]);


       const handleDeleteAddress = async (addressId) => {
              try {
                     const res = await axios.delete(`/api/user/delteAddress?addressId=${addressId}`)

                     if (res.data.success) {
                            toast.success("Address deleted")
                     }
                     setAddresses((prev) => prev.filter((data) => data._id !== addressId))
              } catch (error) {
                     console.log(err);
                     toast.error("Failed to delete address");
              }
       }

       const sideBar = menuOpen
              ? createPortal(
                     <AnimatePresence>
                            <motion.aside
                                   initial={{ x: "-100%" }}
                                   animate={{ x: 0 }}
                                   // exit={{ x: "-100%" }}
                                   exit={{ // HUM EK STH BHI KR SKTE HII ALG-2 BHI
                                          x: "-100%",
                                          opacity: 0, scale: 0.98,
                                          transition: {
                                                 duration: 1.4, ease: [0.4, 0, 0.2, 1]
                                          }
                                   }}
                                   // transition={{ type: "tween", stiffness: 120, damping: 20}}
                                   className="fixed top-0 left-0 z-50 h-screen w-[70vw] md:w-[25vw] text-gray-500 bg-linear-to-r from-green-100 via-green-100 to-orange-100 shadow-2xl rounded-r-xl p-5"
                            >
                                   <div className="flex items-center justify-between mb-6">
                                          <h2 className="text-md font-bold text-orange-500">Admin Panel</h2>
                                          <button onClick={() => setMenuOpen(false)}>
                                                 <img src="/cross-2.gif" alt="icon" className="h-7 cursor-pointer" />
                                          </button>
                                   </div>

                                   <div className="space-y-4 text-sm font-medium">
                                          <div className="text-orange-400 gap-2 flex items-center">
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
                                                        <p className="text-xs font-semibold m-0 leading-tight capitalize line-clamp-1">
                                                               {user?.name}
                                                        </p>
                                                        <p className="text-xs m-0 leading-tight">
                                                               {user?.role || ""}
                                                        </p>
                                                 </span>
                                          </div>

                                          <Link
                                                 href="/admin/addGrocery"
                                                 className="cursor-pointer border p-2 rounded-3xl bg-white text-orange-300 text-xs font-semibold flex items-center gap-1"
                                          >
                                                 Add Grocery <IoIosAddCircleOutline size={13} />
                                          </Link>
                                          <Link
                                                 href="#"
                                                 className="cursor-pointer border p-2 rounded-3xl bg-white text-orange-300 text-xs font-semibold flex items-center gap-1"
                                          >
                                                 View Grocery <FaStreetView />
                                          </Link>

                                          <Link
                                                 href="#"
                                                 className="cursor-pointer border p-2 rounded-3xl bg-white text-orange-300 text-xs font-semibold flex items-center gap-1"
                                          >
                                                 Manage Grocery <MdOutlineManageAccounts size={13} />
                                          </Link>

                                          <div onClick={() => {
                                                 setOpen(false)
                                                 signOut()
                                          }}
                                                 className="flex items-center gap-2 cursor-pointer text-center px-2 hover:bg-white p-2 w-full">
                                                 <AiOutlineLogout color="red" />
                                                 <p className="text-xs font-semibold leading-tight text-red-500">Log Out</p>
                                          </div>
                                   </div>
                            </motion.aside>
                     </AnimatePresence>,
                     document.body
              )
              : null;
       return (
              <nav className="w-full bg-linear-to-r from-green-500 via-green-400 to-orange-500 shadow-md">
                     <div className="max-w-7xl mx-auto px-4">
                            <div className="h-16 flex items-center justify-between">
                                   <Image src="/grozo.png" alt="logo" height={150} width={140} loading="eager" priority />


                                   {user?.role === "user" &&
                                          <div className="relative">
                                                 <button onClick={() => setLocationOpen(prev => !prev)}
                                                        className="flex items-center cursor-pointer">
                                                        <img src="/location-2.gif" className="h-8" />
                                                        <FaAnglesDown className="cursor-pointer" size={20} />
                                                 </button>
                                                 <AnimatePresence>
                                                        {locationOpen &&
                                                               <motion.div
                                                                      initial={{
                                                                             y: 10, opacity: 0, scale: 0.5
                                                                      }}
                                                                      animate={{
                                                                             x: 0, opacity: 1, scale: 1
                                                                      }}
                                                                      exit={{
                                                                             opacity: 0, y: -10, scale: 0.95
                                                                      }}
                                                                      transition={{
                                                                             duration: 0.3
                                                                      }}
                                                                      className="absolute top-full md:-right-50 -right-10 mt-2 text-gray-800 bg-gray-100 md:w-90 w-60 p-3 rounded-md shadow-lg z-30">
                                                                      {addresses.length === 0 ? (
                                                                             <p className="text-sm text-gray-500">No saved address</p>
                                                                      ) : (
                                                                             addresses.map((addr) => (
                                                                                    <div
                                                                                           key={addr._id}
                                                                                           onClick={() => dispatch(setSelectedAddress(addr))}
                                                                                           className="border-b pb-2 mb-2 cursor-pointer hover:bg-gray-200 p-1 rounded"
                                                                                    >
                                                                                           <div
                                                                                                  className="flex gap-2">
                                                                                                  <p className="text-xs font-semibold capitalize">
                                                                                                         {addr.label || "Address"}
                                                                                                  </p>
                                                                                                  <button onClick={() => handleDeleteAddress(addr._id)}>
                                                                                                         <img src="/delete-1.gif" alt="icon" className="w-4 h-4" />
                                                                                                  </button>
                                                                                           </div>

                                                                                           <p className="text-xs text-gray-600 line-clamp-2">
                                                                                                  {addr.fullAddress}
                                                                                           </p>

                                                                                           <p className="text-[11px] text-gray-500">
                                                                                                  {addr.city} - {addr.pinCode}
                                                                                           </p>
                                                                                    </div>
                                                                             ))

                                                                      )}
                                                               </motion.div>
                                                        }
                                                 </AnimatePresence>
                                          </div>
                                   }

                                   {/* <div className="relative">
                                          <button onClick={() => setLocationOpen(prev => !prev)}
                                                 className="flex items-center cursor-pointer">
                                                 <img src="/location-2.gif" className="h-8" />
                                                 <FaAnglesDown className="cursor-pointer" size={20} />
                                          </button>
                                          <AnimatePresence>
                                                 {locationOpen &&
                                                        <motion.div
                                                               initial={{
                                                                      y: 10, opacity: 0, scale: 0.5
                                                               }}
                                                               animate={{
                                                                      x: 0, opacity: 1, scale: 1
                                                               }}
                                                               exit={{
                                                                      opacity: 0, y: -10, scale: 0.95
                                                               }}
                                                               transition={{
                                                                      duration: 0.3
                                                               }}
                                                               className="absolute top-full md:-right-50 -right-10 mt-2 text-gray-800 bg-gray-100 md:w-90 w-60 p-3 rounded-md shadow-lg z-30">
                                                               {addresses.length === 0 ? (
                                                                      <p className="text-sm text-gray-500">No saved address</p>
                                                               ) : (
                                                                      addresses.map((addr) => (
                                                                             <div
                                                                                    key={addr._id}
                                                                                    onClick={() => dispatch(setSelectedAddress(addr))}
                                                                                    className="border-b pb-2 mb-2 cursor-pointer hover:bg-gray-200 p-1 rounded"
                                                                             >
                                                                                    <div
                                                                                           className="flex gap-2">
                                                                                           <p className="text-xs font-semibold capitalize">
                                                                                                  {addr.label || "Address"}
                                                                                           </p>
                                                                                           <button onClick={() => handleDeleteAddress(addr._id)}>
                                                                                                  <img src="/delete-1.gif" alt="icon" className="w-4 h-4" />
                                                                                           </button>
                                                                                    </div>

                                                                                    <p className="text-xs text-gray-600 line-clamp-2">
                                                                                           {addr.fullAddress}
                                                                                    </p>

                                                                                    <p className="text-[11px] text-gray-500">
                                                                                           {addr.city} - {addr.pinCode}
                                                                                    </p>
                                                                             </div>
                                                                      ))

                                                               )}
                                                        </motion.div>
                                                 }
                                          </AnimatePresence>
                                   </div> */}

                                   {user?.role === "user" &&
                                          <div className="hidden md:block relative w-full max-w-md">
                                                 <input
                                                        type="text"
                                                        placeholder="Search for grocery..."
                                                        className="w-full pl-14 pr-4 py-1.5 rounded-full border border-gray-200
                                                        text-gray-700 placeholder-gray-400
                                                        focus:outline-none focus:ring-1 focus:ring-green-100     bg-gray-100 shadow-sm hover:shadow-md transition"
                                                 />
                                                 <img
                                                        src="/surch-3.gif"
                                                        alt="search icon"
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
                                                 />
                                          </div>
                                   }

                                   <div className={`flex md:gap-7 ${user?.role === "admin" ? "gap-7" : "gap-2"}`}>
                                          {user?.role === "user" &&
                                                 <Link href="/user/cart" className="flex items-center gap-1 relative">
                                                        <Image
                                                               src="/trolleyBag.gif"
                                                               alt="cart"
                                                               height={40}
                                                               width={40}
                                                               className="border border-orange-300 rounded-full p-1"
                                                        />
                                                        <span className="absolute -top-1 -right-1 md:bg-orange-400  md:text-white text-red-500 font-bold text-xs md:h-5 md:w-5 flex items-center justify-center rounded-full">
                                                               {cartData?.length || 0}
                                                        </span>
                                                 </Link>
                                          }

                                          {user?.role === "admin" &&
                                                 <div className="space-x-5 flex items-center">

                                                        <div className="hidden md:flex space-x-5 items-center">
                                                               <motion.div whileTap={{ scale: 0.93 }}>
                                                                      <Link
                                                                             href="/admin/addGrocery"
                                                                             className="cursor-pointer border p-2 rounded-3xl bg-white text-orange-300 text-xs font-semibold flex items-center gap-1"
                                                                      >
                                                                             Add Grocery <IoIosAddCircleOutline size={13} />
                                                                      </Link>
                                                               </motion.div>

                                                               <motion.div whileTap={{ scale: 0.93 }}>
                                                                      <Link
                                                                             href="#"
                                                                             className="cursor-pointer border p-2 rounded-3xl bg-white text-orange-300 text-xs font-semibold flex items-center gap-1"
                                                                      >
                                                                             View Grocery <FaStreetView />
                                                                      </Link>
                                                               </motion.div>

                                                               <motion.div whileTap={{ scale: 0.93 }}>
                                                                      <Link
                                                                             href="/admin/manage-grocery"
                                                                             className="cursor-pointer border p-2 rounded-3xl bg-white text-orange-300 text-xs font-semibold flex items-center gap-1"
                                                                      >
                                                                             Manage Grocery <MdOutlineManageAccounts size={13} />
                                                                      </Link>
                                                               </motion.div>
                                                        </div>

                                                        <div
                                                               className="md:hidden cursor-pointer"
                                                               onClick={() => setMenuOpen(prev => !prev)}
                                                        >
                                                               {menuOpen ? (
                                                                      <img
                                                                             src="/cross-3.gif"
                                                                             alt="close icon"
                                                                             className="h-7"
                                                                      />
                                                               ) : (
                                                                      <FaBars size={20} />
                                                               )}
                                                        </div>
                                                 </div>
                                          }

                                          {/* YE MOTION KA ANIMATION DENE KE LIYE YE TB USE HOTA JB KOI BUTOON CLIK KRNE PR CARD DIKHE TO USE OPEN AUR EXIST KRTE SMYE YE ANIMATION KRTA HII */}
                                          <div className="relative items-center">
                                                 <button onClick={() => setOpen(prev => !prev)}>
                                                        <Image src={user?.profilePic || "/avatar.gif"} alt="img" height={35} width={35} className="rounded-full cursor-pointer" />
                                                 </button>
                                                 <AnimatePresence>
                                                        {open && (
                                                               <motion.div
                                                                      className="absolute top-full right-0 mt-2 bg-gray-100 w-48 p-3 rounded-md shadow-lg z-50"
                                                                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                                      transition={{ duration: 0.3 }}
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
                                                                                           {user?.role || ""}
                                                                                    </p>
                                                                             </span>
                                                                      </div>

                                                                      {user?.role === "user" &&
                                                                             <button onClick={() => router.push("/user/myOrder")}
                                                                                    className="flex items-center gap-2 hover:bg-green-100 cursor-pointer p-1">
                                                                                    <Image src="/order.gif" alt="icon" height={30} width={30} />
                                                                                    <p className="text-sm font-semibold leading-tight text-gray-600">My Order</p>
                                                                             </button>
                                                                      }

                                                                      <div onClick={() => {
                                                                             setOpen(false)
                                                                             signOut()
                                                                      }}
                                                                             className="flex items-center gap-4      cursor-pointer text-center px-2      hover:bg-red-100 p-2">
                                                                             <AiOutlineLogout color="red" />
                                                                             <p className="text-sm font-semibold      leading-tight text-gray-600">Log Out</p>
                                                                      </div>
                                                               </motion.div>
                                                        )}
                                                 </AnimatePresence>
                                          </div>

                                   </div>
                            </div>
                     </div>

                     {user?.role === "user" &&
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
                     }
                     {sideBar}
              </nav>
       );
};
export default Nav;




