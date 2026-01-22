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


const MapComponent = dynamic(() => import("@/component/MapComponent"), {
       ssr: false, //ssr:false ka use hum isliye karte hain kyunki kuch libraries browser-only hoti hain, jaise Leaflet, jo window aur document pe depend karti hain. Next.js by default server-side render karta hai, isliye agar aise components ko server pe render karenge to error aata hai. ssr:false se hum ensure karte hain ki component sirf client/browser me hi render ho.”
})

const Page = () => {
       const router = useRouter();

       // 🔹 Redux user data
       const { userData } = useSelector((state) => state.user);

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

       const [position, setPosition] = useState(null);
       const [searchText, setSearchText] = useState("");
       const [loadingSearch, setLoadingSearch] = useState(false);


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
                                   // position[0]INDEX MTLB latitude [1]INDEX MTLB longitude
                                   params: { lat: position[0], lon: position[1], },
                            });
                            console.log(res.data)

                            // ISKO YAHA DIRECT LIKHO NHI TO REDUX ME BHEJ KR AUR SARA DATA JAHA HII VAHA LIK KSTE Hii.
                            reset({
                                   // display_name iS LIYE KYUKI JB RES KO PRINT KROGE USI MEA DATA HII .
                                   address: res.data.display_name || "",
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
                     console.log(`search : ${res.data}`)
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

       // 🔥 IMPORTANT: redux data aate hi form fill karo
       useEffect(() => {
              if (userData) {
                     reset({
                            name: userData?.name || "",
                            mobile: userData?.mobile || "",
                     });
              }
       }, [userData, reset]);

       const onSubmit = (data) => {
              console.log("FORM DATA 👉", data);
              alert("Address Saved Successfully ✅");
       };

       return (
              <div className="w-full min-h-screen  bg-gray-50 text-gray-700 relative flex flex-col items-center">

                     {/* BACK BUTTON */}
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

                     <div className="w-full flex md:flex-row flex-col items-center gap-5 p-5 mt-20">

                            {/* LEFT FORM */}
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

                                          <button
                                                 disabled={isSubmitting}
                                                 className="bg-orange-500 text-white px-4 py-2 rounded-sm hover:bg-orange-600 transition"
                                          >
                                                 {isSubmitting ? "Saving..." : "Save Address"}
                                          </button>


                                          <div className="flex md:flex-row flex-col gap-2">
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
                                   </form>

                            </motion.div>

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
                                   className="md:w-[40%] w-full bg-linear-to-r from-green-50 rounded p-4 shadow-md">
                                   <h3 className="font-semibold text-lg">Select Payment Method</h3>
                                   <p className="text-sm text-gray-600 mt-2">
                                          Cart summary yahan aayega 🙂
                                   </p>
                            </motion.div>
                     </div>

                     <div className="w-full px-5 mb-10 shadow-md rounded">
                            <MapComponent position={position} setPosition={setPosition} />
                     </div>
              </div>
       );
};

export default Page;


