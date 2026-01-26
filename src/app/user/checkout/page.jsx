"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "sonner";
import { SiContactlesspayment } from "react-icons/si";
import { TbCurrentLocation } from "react-icons/tb";
import { MdAssuredWorkload } from "react-icons/md";

const MapComponent = dynamic(() => import("@/component/MapComponent"), {
       ssr: false, //ssr:false ka use hum isliye karte hain kyunki kuch libraries browser-only hoti hain, jaise Leaflet, jo window aur document pe depend karti hain. Next.js by default server-side render karta hai, isliye agar aise components ko server pe render karenge to error aata hai. ssr:false se hum ensure karte hain ki component sirf client/browser me hi render ho.”
})

const Page = () => {
       const router = useRouter();

       const [position, setPosition] = useState(null);
       const [searchText, setSearchText] = useState("");
       const [loadingSearch, setLoadingSearch] = useState(false);
       const [selectedLabel, setSelectedLabel] = useState("home");
       const { userData } = useSelector((state) => state.user);




       //2-CONTAINER
       const [selectPaymentMethod, setSelectPaymentMethod] = useState("online")
       const { grandTotal, cartData, platformCharge, discount, deliveryCharge } = useSelector((state) => state.card);
       const { selectedAddress } = useSelector((state) => state.address);


       const handlePlaceOrder = async () => {
              if (!userData?._id) {
                     toast.error("Please login first");
                     return;
              }

              if (!cartData) {
                     toast.error("Cart is empty");
                     return;
              }

              if (!selectedAddress) {
                     toast.error("Address not selected");
                     router.push("/")
                     return;
              }

              try {
                     if (selectPaymentMethod === "cod") {
                            const res = await axios.post("/api/user/placeOrderCod", {
                                   user: userData?._id,
                                   items: cartData,
                                   paymentMethod: "cod",
                                   address: selectedAddress?._id,
                                   totalAmount: grandTotal,
                            });

                            if (res.data.success) {
                                   console.log(res)
                                   toast.success("Order placed successfully(COD)");
                                   router.push("/user/payment-success");
                            }
                     }

                     if (selectPaymentMethod === "online") {
                            const res = await axios.post("/api/user/placeOrderOnline", {
                                   user: userData?._id,
                                   items: cartData,
                                   paymentMethod: "online",
                                   address: selectedAddress?._id,
                                   totalAmount: grandTotal,
                                   plateFormPiss:platformCharge,
                                   disCount:discount,
                                   dileviryChrge :deliveryCharge
                            })
                            if (res.data.success) {
                                   window.location.href = res.data.url;  // 🧠 “Online payment me backend Stripe checkout session create karta hai aur ek secure URL return karta hai. Browser ka control frontend ke paas hota hai, isliye frontend window.location.href se user ko Stripe checkout page par redirect karta hai.”
                            }
                     }
              } catch (err) {
                     console.log(err.response?.data || err);
                     toast.error("Order failed");
              }
       };


       const {
              register,
              handleSubmit,
              reset,
              formState: { errors, isSubmitting },
       } = useForm({
              defaultValues: {
                     name: "",
                     mobile: "",
              },
       });


       useEffect(() => {
              // navigator built in function hota hii js ke under.
              if (navigator.geolocation) {
                     // 🔥 getCurrentPosition ISKE UNDER TO PERAMETER HOTA HII latitude, longitude,
                     navigator.geolocation.getCurrentPosition(
                            (position) => {
                                   // coords JB CONSOLEKAROGE TO coords MILEGA.
                                   const { latitude, longitude } = position.coords;
                                   // ✅ Correct
                                   setPosition([latitude, longitude]);
                            },
                            (err) => {
                                   console.error("Location error:", err),
                                   {
                                          enableHighAccuracy: true, // GPS accuracy high
                                          maximumAge: 0, // Browser kabhi-kabhi purani (cached) location yaad rakh leta hai
                                          timeout: 10000 // 10 seconds mea nhi milta to bata do nhi mila location
                                   }
                            }
                     );
              }
       }, []);


       useEffect(() => {
              const fetchAddress = async () => {
                     if (!position) return;

                     try {
                            const res = await axios.get("/api/reverseGeocode", {
                                   //🧠 position[0]INDEX MTLB latitude [1]INDEX MTLB longitude
                                   params: { lat: position[0], lon: position[1], },
                            });

                            // console.log("current datas:" , res.data) 

                            // 🧠 ISKO YAHA DIRECT LIKHO NHI TO REDUX ME BHEJ KR AUR SARA DATA JAHA HII VAHA LIK KSTE Hii.
                            reset({
                                   // 🧠 display_name iS LIYE KYUKI JB RES KO PRINT KROGE USI MEA DATA HII .
                                   address: res.data.display_name || "",
                                   city: res.data.address.county || "", // 🧠 JB RES KO PRINT KROGE TO PATA CHAL JYEGA KYU LIKHA GYA HII address.county
                                   pinCode: res.data.address.postcode || "",
                            });

                     } catch (error) {
                            console.log("fetchAddress error:", error);
                            toast.error("Unable to fetch address");
                     }
              };
              fetchAddress();
       }, [position, reset]);


       const handleSearchLocation = async () => {
              if (!searchText.trim()) return;
              try {
                     setLoadingSearch(true);

                     const res = await axios.get("/api/searchLocation", { params: { q: searchText }, });

                     if (!res.data) {
                            toast.info("Location not found plz try Again")
                            return;
                     }
                     const lat = parseFloat(res.data.lat);
                     const lon = parseFloat(res.data.lon);

                     // 🔥 Map + reverse geocode dono set ho jyenge is liye
                     setPosition([lat, lon]);

              } catch (err) {
                     console.error("Search error:", err);
              } finally {
                     setLoadingSearch(false);
              }
       };

       // 🔥 IMPORTANT: redux data aate hi NAME KI VALU NAME MEA SO ON
       useEffect(() => {
              if (userData) {
                     reset({
                            name: userData?.name || "",
                            mobile: userData?.mobile || "",
                     });
              }
       }, [userData]);


       const onSubmit = async (data) => {
              if (!position) {
                     toast.error("Please select location");
                     return;
              }
              try {
                     const payload = {
                            user: userData?._id,
                            name: data.name,
                            mobile: data.mobile,
                            fullAddress: data.address,
                            city: data.city,
                            pinCode: data.pinCode,
                            latitude: Number(position[0]),
                            longitude: Number(position[1]),
                            label: selectedLabel,
                     };

                     const res = await axios.post("/api/user/userAddress", payload);

                     if (res.data.success) {
                            toast.success("Address saved successfully");
                     }
              } catch (error) {
                     console.log(error.response?.data || error);
                     toast.error("Failed to save address");
              }
       };


       return (
              <div className="w-full min-h-screen  bg-gray-50 text-gray-700 relative flex flex-col items-center">

                     <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            onClick={() => router.push("/user/cart")}
                            className="flex items-center gap-1 absolute top-4 left-4 cursor-pointer z-10"
                     >
                            <IoMdArrowBack size={22} />
                            <p className="font-semibold">Back</p>
                     </motion.div>

                     <div className="w-full flex md:flex-row flex-col items-center gap-5 md:p-5 p-1 mt-20">

                            {/* LEFT CONTAINER*/}
                            <motion.div
                                   initial={{
                                          y: -60, opacity: 0
                                   }}
                                   animate={{
                                          y: 0, opacity: 1
                                   }}
                                   transition={{
                                          duration: 0.5, ease: "easeOut"
                                   }}
                                   className="md:w-[60%] w-full bg-linear-to-r from-green-50 p-5 rounded shadow-lg">
                                   <div className="flex items-center gap-2 mb-4">
                                          <img src="/locationPin.gif" alt="icon" className="h-8" />
                                          <span className="font-semibold text-sm">Delivery Address</span>
                                   </div>


                                   <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                          <div>
                                                 <div className="relative">
                                                        <img src="/user.gif" alt="icon" className="h-5 w-5 absolute left-2 top-1/2 -translate-y-1/2 " />
                                                        <input
                                                               type="text"
                                                               placeholder="Enter Name"
                                                               {...register("name", {
                                                                      required: "Name is required",
                                                                      validate: (value) =>
                                                                             value.trim().length > 0 || "Spaces not allowed",
                                                               })}
                                                               className="border p-2 pl-9 w-full rounded-sm shadow-md focus:outline-none"
                                                        />
                                                 </div>
                                                 {errors.name && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                               {errors.name.message}
                                                        </p>
                                                 )}
                                          </div>

                                          <div className="space-y-1">
                                                 <div className="relative">
                                                        <img
                                                               src="/phone.gif"
                                                               alt="phone"
                                                               className="h-5 w-5 absolute left-2 top-1/2 -translate-y-1/2 "
                                                        />

                                                        <input
                                                               type="tel"
                                                               placeholder="Enter Phone Number"
                                                               {...register("mobile", {
                                                                      required: "Mobile number is required",
                                                                      minLength: {
                                                                             value: 10,
                                                                             message: "Must be 10 digits",
                                                                      },
                                                                      maxLength: {
                                                                             value: 10,
                                                                             message: "Must be 10 digits",
                                                                      },
                                                                      pattern: {
                                                                             value: /^[0-9]+$/,
                                                                             message: "Only numbers allowed",
                                                                      },
                                                               })}
                                                               onInput={(e) =>
                                                                      (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                                                               }
                                                               className="border p-2 pl-9 w-full rounded-sm shadow-md focus:outline-none"
                                                        />
                                                 </div>
                                                 {errors.mobile && (
                                                        <p className="text-red-500 text-xs ml-1">
                                                               {errors.mobile.message}
                                                        </p>
                                                 )}
                                          </div>


                                          <div className="flex gap-5">
                                                 <div onClick={() => setSelectedLabel("home")}
                                                        className={`flex items-center gap-1 border ${selectedLabel === "home" && "border-green-500"} p-1 cursor-pointer`}>
                                                        <img src="/home-2.gif" alt="icon" className="h-8 w-8" />
                                                        <p className="text-sm font-semibold">Home</p>
                                                 </div>

                                                 <div onClick={() => setSelectedLabel("work")}
                                                        className={`flex items-center gap-1 border ${selectedLabel === "work" && "border-green-500"} p-1 cursor-pointer`}>
                                                        <MdAssuredWorkload size={25} className="text-blue-500" />
                                                        <p className="text-sm font-semibold">Work</p>
                                                 </div>
                                          </div>


                                          <div>
                                                 <div className="relative">
                                                        <img src="/home.gif" alt="icon" className="h-5 w-5 absolute left-2 top-1/2 -translate-y-1/2 " />
                                                        <input
                                                               type="text"
                                                               placeholder="Enter Address"
                                                               {...register("address", {
                                                                      required: "Required*",
                                                                      validate: (value) =>
                                                                             value.trim().length > 0 || "Spaces not allowed",
                                                               })}
                                                               className="border p-2 pl-9 w-full rounded-sm shadow-md focus:outline-none"
                                                        />
                                                 </div>
                                                 {errors.address && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                               {errors.address.message}
                                                        </p>
                                                 )}
                                          </div>


                                          <div className="md:flex md:space-x-2 space-y-2 w-full">
                                                 <div>
                                                        <input
                                                               type="text"
                                                               inputMode="numeric"
                                                               placeholder="Enter Pin Code"
                                                               maxLength={6}
                                                               {...register("pinCode", {
                                                                      required: "Pin code is required",
                                                                      minLength: {
                                                                             value: 6,
                                                                             message: "Pin code must be 6 digits",
                                                                      },
                                                                      maxLength: {
                                                                             value: 6,
                                                                             message: "Pin code must be 6 digits",
                                                                      },
                                                                      pattern: {
                                                                             value: /^[0-9]{6}$/,
                                                                             message: "Only numbers allowed",
                                                                      },
                                                               })}
                                                               onInput={(e) => {
                                                                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                               }}
                                                               className="border p-2 rounded-sm shadow-md focus:outline-none w-full"
                                                        />
                                                 </div>

                                                 <div>
                                                        <input
                                                               type="text"
                                                               placeholder="City"
                                                               {...register("city", {
                                                                      required: "City is required",
                                                                      validate: (value) =>
                                                                             value.trim().length > 0 || "Spaces not allowed",
                                                               })}
                                                               className="border p-2 rounded-sm shadow-md focus:outline-none w-full"
                                                        />
                                                 </div>


                                          </div>

                                          <button
                                                 disabled={isSubmitting}
                                                 className="bg-orange-500 text-white px-4 py-2 rounded-sm hover:bg-orange-600 transition"
                                          >
                                                 {isSubmitting ? "Saving..." : "Save Address"}
                                          </button>
                                   </form>
                                   <div className="flex md:flex-row flex-col gap-2 mt-5">
                                          <input
                                                 type="text"
                                                 placeholder="Search location (e.g. Delhi, Noida Sec 62)"
                                                 value={searchText}
                                                 onChange={(e) => setSearchText(e.target.value)}
                                                 className="border p-2 w-full rounded-sm shadow-md focus:outline-none"
                                          />

                                          <button
                                                 type="button"
                                                 disabled={loadingSearch}
                                                 onClick={handleSearchLocation}
                                                 className={`bg-orange-500 text-white px-4 py-2 rounded-sm hover:bg-orange-600 transition 
                                                        flex items-center justify-center gap-2
                                                        ${loadingSearch ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                                          >
                                                 {loadingSearch ? (
                                                        <img src="/loader-2.gif" alt="Loading" className="h-6" />
                                                 ) : (
                                                        "Search"
                                                 )}
                                          </button>

                                   </div>


                                   <motion.button
                                          type="button"
                                          whileTap={{
                                                 scale: 0.88,
                                          }}
                                          whileHover={{
                                                 scale: 1.06,
                                          }}
                                          transition={{
                                                 type: "spring",
                                                 stiffness: 400,
                                                 damping: 15,
                                          }}
                                          onClick={() => {
                                                 navigator.geolocation.getCurrentPosition(
                                                        (pos) => {
                                                               setPosition([pos.coords.latitude, pos.coords.longitude]);
                                                               toast.success("Current location detected");
                                                        },
                                                        (err) => {
                                                               console.log(err);
                                                               toast.error("Location access denied");
                                                        }
                                                 );
                                          }}
                                          className="text-blue-500 flex items-center gap-2 mt-10 underline cursor-pointer"
                                   >
                                          <TbCurrentLocation size={28} />
                                          <p className="text-sm font-semibold">Use my current location</p>
                                   </motion.button>


                            </motion.div>


                            {/* RIGHT CONTAINER*/}
                            <motion.div
                                   initial={{
                                          y: 60, opacity: 0
                                   }}
                                   animate={{
                                          y: 0, opacity: 1
                                   }}
                                   transition={{
                                          duration: 0.5, ease: "easeOut"
                                   }}
                                   className="md:w-[40%] w-full bg-linear-to-r from-green-50 rounded p-4 shadow-md space-y-5">
                                   <h3 className="font-bold text-xl text-center items-center justify-center flex gap-2"><SiContactlesspayment size={40} className="text-blue-500" /> Select Payment Method</h3>

                                   <div className="space-y-5">

                                          {/* ONLINE PAYMENT */}
                                          <button
                                                 onClick={() => setSelectPaymentMethod("online")}
                                                 className={`flex items-center gap-2 border w-full p-2 cursor-pointer rounded ${selectPaymentMethod === "online" ? "border-green-500" : "border-gray-300"}`}
                                          >
                                                 💳
                                                 <p className="text-xs font-semibold">Pay Online (Stripe)</p>
                                          </button>


                                          {/* COD */}
                                          <button
                                                 onClick={() => setSelectPaymentMethod("cod")}
                                                 className={`flex items-center gap-2 border w-full p-2.5 cursor-pointer rounded ${selectPaymentMethod === "cod" ? "border-green-500" : "border-gray-300"}`}
                                          >
                                                 <img src="/cash.gif" alt="icon" className="h-5 w-5" />
                                                 <span className="text-xs font-semibold">Cash on Delivery</span>
                                          </button>
                                          <hr />
                                          <div className="flex justify-between">
                                                 <p className="font-semibold">Total</p>
                                                 <p>₹ {grandTotal}</p>
                                          </div>


                                          <button onClick={handlePlaceOrder}
                                                 className="flex items-center justify-center border w-full cursor-pointer rounded p-1 shadow hover:shadow-none transition-all duration-300 shadow-blue-100"
                                          >
                                                 <span className="flex items-center gap-1">
                                                        <p className="text-sm font-semibold">Place Order</p>
                                                        <img src="/next.gif" alt="icon" className="h-8 w-8 mt-1" />
                                                 </span>
                                          </button>


                                   </div>
                            </motion.div>
                     </div>

                     <div className="w-full px-5 mb-10 shadow-md rounded">
                            <MapComponent position={position} setPosition={setPosition} />
                     </div>
              </div>
       );
};

export default Page;
