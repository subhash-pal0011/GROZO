"use client";
import React, { useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { IoIosAdd } from "react-icons/io";
import { IoRemoveOutline } from "react-icons/io5";
import { addCartData, calculateTotal, removeCartData } from "@/redux/cartSlice";

const Page = () => {
       const router = useRouter();
       const { cartData, totalPrice, deliveryCharge, platformCharge, grandTotal, discount } = useSelector((state) => state.card);
       console.log(`discount : ${discount}`)

       const dispatch = useDispatch()

       useEffect(() => {
              dispatch(calculateTotal());
       }, [cartData, dispatch]); //JESE-2 CARTDATA MEA ELEMENT AYEGA VESE-2 calculateTota CAll hoga


       const isEmpty = !cartData || cartData.length === 0;

       return (
              <div className="w-full min-h-screen relative bg-gray-50 text-gray-700">

                     {/* BACK BUTTON */}
                     <motion.div
                            initial={{
                                   x: 100, opacity: 0
                            }}
                            animate={{
                                   x: 0, opacity: 1
                            }}
                            transition={{
                                   duration: 0.6, ease: "easeOut"
                            }}

                            onClick={() => router.push("/")}
                            className="flex items-center gap-1 absolute top-4 left-4 cursor-pointer z-10"
                     >
                            <IoMdArrowBack size={22} />
                            <p className="font-semibold">Back</p>
                     </motion.div>

                     {/* EMPTY CART */}
                     {isEmpty ? (
                            <motion.div
                                   initial={{ y: 50, opacity: 0 }}
                                   animate={{ y: 0, opacity: 1 }}
                                   transition={{ duration: 0.6, ease: "easeOut" }}
                                   className="min-h-screen flex flex-col items-center justify-center 
                                   bg-linear-to-r from-green-50 via-green-50 to-orange-50"
                            >
                                   <Image src="/basket.gif" alt="basket" height={200} width={200} />
                                   <h3 className="text-xl font-semibold mt-3">
                                          Your basket is empty!
                                   </h3>
                                   <button
                                          onClick={() => router.push("/")}
                                          className="mt-4 px-6 py-2 text-sm rounded
                                          bg-linear-to-r from-green-200 via-green-200 to-orange-200 shadow shadow-orange-200 cursor-pointer hover:shadow-2xl transition-all duration-300"
                                   >
                                          Shop now
                                   </button>
                            </motion.div>
                     ) : (
                            <div className="flex flex-col md:flex-row gap-6 p-5 pt-16">

                                   <div
                                          className="flex flex-col gap-4 md:w-[70%] w-full
                                    max-h-[80vh] overflow-y-auto bg-linear-to-r from-gray-100 via-green-50 to-orange-50 p-3 rounded"
                                   >
                                          {cartData.map((item) => (
                                                 <motion.div
                                                        initial={{
                                                               y: 60, opacity: 1
                                                        }}
                                                        animate={{
                                                               y: 0, opacity: 1
                                                        }}
                                                        transition={{
                                                               duration: 0.5, ease: "easeOut"
                                                        }}
                                                        key={item._id}
                                                        className="flex md:justify-between justify-center
                                                       items-center bg-white p-4 rounded shadow-xl"
                                                 >
                                                        <div className="flex md:flex-row flex-col gap-3 items-center w-full">
                                                               <Image
                                                                      src={item.image}
                                                                      alt={item.name}
                                                                      width={60}
                                                                      height={60}
                                                                      className="object-contain"
                                                               />

                                                               <div className="space-y-1 w-full text-center md:text-left">
                                                                      <p
                                                                             className="font-semibold capitalize text-gray-800 line-clamp-1"
                                                                      >
                                                                             {item.name}
                                                                      </p>

                                                                      <p className="text-xs text-gray-500">
                                                                             {item.unit}
                                                                      </p>

                                                                      <p className="text-green-600 font-bold">
                                                                             ₹{Number(item.price) * item.qty}
                                                                      </p>
                                                               </div>

                                                               {/* MOBILE BUTTON */}
                                                               <div className="px-4 py-1 bg-green-200 rounded lg:hidden flex items-center gap-2">
                                                                      <IoIosAdd onClick={() => dispatch(addCartData(item))} size={25} className="cursor-pointer" />
                                                                      <span className="font-semibold">{item.qty}</span>
                                                                      <IoRemoveOutline onClick={() => dispatch(removeCartData(item._id))} size={25} className="cursor-pointer" />
                                                               </div>
                                                        </div>

                                                        {/* DESKTOP BUTTON */}
                                                        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-linear-to-r from-green-100 via-green-100 to-orange-100 rounded">
                                                               <IoRemoveOutline onClick={() => dispatch(removeCartData(item._id))} className="cursor-pointer" />

                                                               <span className="font-semibold">{item.qty}</span>

                                                               <IoIosAdd onClick={() => dispatch(addCartData(item))} className="cursor-pointer" />
                                                        </div>
                                                 </motion.div>
                                          ))}
                                   </div>

                                   {/* RIGHT : SUMMARY */}
                                   <motion.div
                                          initial={{
                                                 y: -60, opacity: 1
                                          }}
                                          animate={{
                                                 y: 0, opacity: 1
                                          }}
                                          transition={{
                                                 duration: 0.5, ease: "easeOut"
                                          }}

                                          className="md:w-[30%] w-full bg-linear-to-r from-orange-50 via-green-50 to-green-50 p-2 rounded shadow-md h-fit space-y-2">
                                          <h3 className="font-semibold text-xl text-center">Summary</h3>
                                          <hr className="mt-2" />

                                          <div className="w-full space-x-5 p-1 px-5 justify-between flex ">
                                                 <span className="text-gray-600">Total items :</span>
                                                 <span className="text-gray-800 font-semibold">{cartData?.length}</span>
                                          </div>


                                          <div className="w-full space-x-6 p-1  px-5 justify-between flex">
                                                 <span className="text-gray-600">Total price :</span>
                                                 <span className="text-gray-800 font-semibold">{totalPrice}</span>
                                          </div>

                                          <div className="w-full space-x-3 p-1  px-5 justify-between flex">
                                                 <span className="text-gray-600">Platform Fee :</span>
                                                 <span className="text-gray-800 font-semibold">{platformCharge}</span>
                                          </div>

                                          <div className="w-full space-x-0.5 p-1  px-5 justify-between flex">
                                                 <span className="text-gray-600">Dilevery Charge :</span>
                                                 <span className="text-gray-800 font-semibold">{deliveryCharge}</span>
                                          </div>

                                          <hr className="mt-4" />

                                          <div className="w-full space-x-3 p-3 px-5 justify-between flex">
                                                 <span className="text-green-600 text-xl">Total Amount :</span>
                                                 <span className="text-gray-900 font-semibold">{grandTotal}</span>
                                          </div>

                                          {discount > 0 && (
                                                 <motion.div
                                                        initial={{
                                                               opacity: 0, y: 10
                                                        }}
                                                        animate={{
                                                               opacity: 1, y: 0
                                                        }}
                                                        transition={{
                                                               duration: 0.4
                                                        }}
                                                        className="shadow-xl shadow-orange-200 p-2 rounded bg-green-50 text-center"
                                                 >
                                                        🎉<span className="text-green-600 text-sm font-semibold">
                                                               Congratulations!
                                                        </span>{" "}
                                                        You saved{" "}
                                                        <span className="text-green-600 text-xl font-semibold">
                                                               ₹{discount}
                                                        </span>
                                                 </motion.div>
                                          )}

                                          <div onClick={() => router.push("/user/checkout")}
                                                 className=" flex items-center justify-center cursor-pointer shadow-md  shadow-gray-600 hover:shadow-none transition-all duration-300">
                                                 <span className="text-green-500 font-semibold">Next</span>
                                                 <img src="/next.gif" alt="icon" className="h-10" />
                                          </div>
                                   </motion.div>
                            </div>
                     )}
              </div>
       );
};

export default Page;
