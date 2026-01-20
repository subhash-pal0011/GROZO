// "use client";

// import React from "react";
// import { IoMdArrowBack } from "react-icons/io";
// import { useRouter } from "next/navigation";

// import { motion } from "framer-motion";
// import { useSelector } from "react-redux";
// import Image from "next/image";

// const Page = () => {
//        const router = useRouter();
//        const { cartData } = useSelector((state) => state.card);
//        console.log(`cartData : ${cartData}`)

//        return (
//               <div className="w-full min-h-screen flex items-center justify-center relative bg-gray-50 text-gray-700">

//                      <div
//                             onClick={() => router.push("/")}
//                             className="flex items-center gap-1 absolute top-4 left-4 cursor-pointer"
//                      >
//                             <IoMdArrowBack size={25} />
//                             <p className="font-semibold">Back</p>
//                      </div>


//                      {!cartData ? (
//                             <motion.div
//                                    initial={{
//                                           y: 50,
//                                           opacity: 0,
//                                    }}
//                                    animate={{
//                                           y: 0,
//                                           opacity: 1,
//                                    }}
//                                    transition={{
//                                           duration: 0.6,
//                                           ease: "easeOut",
//                                    }}
//                                    className="bg-linear-to-r from-green-50 via-green-50 to-orange-50 w-full justify-center flex flex-col items-center p-5 shadow-2xl shadow-orange-150">
//                                    <Image src="/basket.gif" alt="basket" height={200} width={200} />
//                                    <h3 className="text-xl font-semibold text-center">Your basket is empty!</h3>
//                                    <button onClick={() => router.push("/")} className="border px-5 p-2 mt-3 text-sm rounded-xs bg-linear-to-r from-green-200 via-green-200 to-orange-200 text-gray-600 shadow shadow-orange-200 cursor-pointer">Shop now</button>
//                             </motion.div>
//                      )
//                             :
//                             (
//                                    <div className="flex flex-col  md:flex-row gap-6 w-full p-5 mt-5">

//                                           {/* LEFT */}
//                                           <div className="flex flex-col gap-4 md:w-[70%] w-full  max-h-[80vh]
//                                            overflow-y-auto bg-linear-to-r from-green-50 via-green-50 to-orange-50 p-2">
//                                                  {cartData.map((item) => (
//                                                         <div
//                                                                key={item._id}
//                                                                className="flex md:justify-between items-center bg-white p-4 rounded shadow justify-center"
//                                                         >
//                                                                <div className="flex md:flex-row flex-col gap-2 items-center">
//                                                                       <Image
//                                                                              src={item.image}
//                                                                              alt={item.name}
//                                                                              width={60}
//                                                                              height={60}
//                                                                       />
//                                                                       <div className="space-y-0.5">
//                                                                              <p className="font-semibold max-w-50 capitalize w-full text-gray-800">
//                                                                                     {item.name}
//                                                                              </p>

//                                                                              <p className="text-xs text-gray-500">
//                                                                                     {item.unit}
//                                                                              </p>

//                                                                              <p className="text-green-600 font-bold">
//                                                                                     ₹{item.price}
//                                                                              </p>
//                                                                       </div>
//                                                                       <button className="px-4 py-1 bg-green-200 rounded lg:hidden">
//                                                                              Adde
//                                                                       </button>

//                                                                </div>

//                                                                <button className="px-4 py-1 bg-green-200 rounded hidden lg:block">
//                                                                       Add
//                                                                </button>
//                                                         </div>

//                                                  ))}

//                                           </div>

//                                           {/* RIGHT */}
//                                           <div className="md:w-[30%] w-full bg-white p-4 rounded shadow">
//                                                  Summary Box
//                                           </div>
//                                    </div>
//                             )
//                      }


//               </div>
//        );
// };

// export default Page;



"use client";
import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { IoIosAdd } from "react-icons/io";
import { IoRemoveOutline } from "react-icons/io5";
import { addCartData, removeCartData } from "@/redux/cartSlice";

const Page = () => {
       const router = useRouter();
       const { cartData } = useSelector((state) => state.card);
       const dispatch = useDispatch()

       const isEmpty = !cartData || cartData.length === 0;

       return (
              <div className="w-full min-h-screen relative bg-gray-50 text-gray-700">

                     {/* BACK BUTTON */}
                     <div
                            onClick={() => router.push("/")}
                            className="flex items-center gap-1 absolute top-4 left-4 cursor-pointer z-10"
                     >
                            <IoMdArrowBack size={22} />
                            <p className="font-semibold">Back</p>
                     </div>

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
                                          bg-linear-to-r from-green-200 via-green-200 to-orange-200 shadow shadow-orange-200"
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
                                                 <div
                                                        key={item._id}
                                                        className="flex md:justify-between justify-center
                                                       items-center bg-white p-4 rounded shadow"
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
                                                                      <IoIosAdd className="cursor-pointer" size={25}/>
                                                                      <span className="font-semibold">{item.qty}</span>
                                                                      <IoRemoveOutline size={25}className="cursor-pointer"/>
                                                               </div>
                                                        </div>

                                                        {/* DESKTOP BUTTON */}
                                                        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-linear-to-r from-green-100 via-green-100 to-orange-100 rounded">
                                                               <IoIosAdd onClick={()=>dispatch(addCartData(item))} className="cursor-pointer" />
                                                               <span className="font-semibold">{item.qty}</span>
                                                               <IoRemoveOutline onClick={()=>dispatch(removeCartData(item._id))} className="cursor-pointer" />
                                                        </div>

                                                 </div>
                                          ))}
                                   </div>

                                   {/* RIGHT : SUMMARY */}
                                   <div className="md:w-[30%] w-full bg-linear-to-r from-orange-50 via-green-50 to-green-50 p-4 rounded shadow h-fit">
                                          <h3 className="font-semibold text-lg mb-3">Summary</h3>
                                          <p className="text-sm text-gray-600">
                                                 Total items: {cartData.length}
                                          </p>
                                   </div>
                            </div>
                     )}
              </div>
       );
};

export default Page;
