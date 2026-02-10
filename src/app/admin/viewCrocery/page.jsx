"use client";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";


const Page = () => {
       const router = useRouter();
       const [getOrder, setGetOrder] = useState([]);
       const [editForm, setEditForm] = useState(false);
       const [selectedItem, setSelectedItem] = useState(null);
       const [search, setSearch] = useState("")

       const {
              register,
              handleSubmit,
              reset,
              formState: { errors, isSubmitting },
       } = useForm();

       const filteredGrocery = getOrder.filter((item) =>
              `${item.name} ${item.unit}` // HUM UNIT KE HISB SE BHI SEARCH KR SKTE HII AUR NAME SE BHAI
              .toLowerCase()
              .includes(search.toLowerCase())
       );


       useEffect(() => {
              const getGrocery = async () => {
                     try {
                            const res = await axios.get("/api/admin/getAllGrocery");

                            if (res.data.success) {
                                   setGetOrder(res.data.data);
                                   console.log(res.data.data)
                            } else {
                                   toast.error(res.data.message);
                            }
                     } catch (error) {
                            toast.error("Failed to fetch grocery data");
                            console.log("error getGrocery :", error);
                     }
              };

              getGrocery();
       }, []);


       const onSubmit = async (data) => {
              try {
                     const res = await axios.post("/api/admin/editGrocery", { id: selectedItem._id, ...data });

                     if (res.data.success) {
                            toast.success(res.data.message);

                            setGetOrder((prev) =>
                                   prev.map((item) =>
                                          item._id === selectedItem._id ? { ...item, ...data }
                                                 :
                                                 item
                                   )
                            );
                            setEditForm(false);
                     } else {
                            toast.error(res.data.message);
                     }
              } catch (err) {
                     toast.error("Update failed");
                     console.log(err);
              }
       };


       const deleteGrocery = async (id) => {
              try {
                     const res = await axios.delete("/api/admin/deleteProduct", {
                            data: { id },
                     });

                     if (res.data.success) {
                            toast.success(res.data.message);
                            //  UI se turant remove
                            setGetOrder((prev) => prev.filter((item) => item._id !== id));
                            setEditForm(false);
                     } else {
                            toast.error(res.data.message);
                     }
              } catch (error) {
                     toast.error("Delete failed");
                     console.log(error);
              }
       };




       return (
              <div className="w-full min-h-screen bg-linear-to-r from-green-100 via-green-100 to-orange-100 text-gray-700 md:p-5 p-3">

                     {/* 🔙 HEADER */}
                     <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-center gap-2 mb-6"
                     >
                            <button
                                   onClick={() => router.back()}
                                   className="flex items-center gap-1 font-semibold text-sm cursor-pointer hover:text-orange-500 transition"
                            >
                                   <IoArrowBack size={22} />
                                   Back
                            </button>
                     </motion.div>

                     {/* 🔍 SEARCH */}
                     <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-lg mx-auto bg-white rounded-xl shadow p-3 mb-6"
                     >
                            <form
                                   className="flex items-center gap-3"
                            >
                                   <img src="/surch.gif" alt="search" className="h-6 w-6" />
                                   <input
                                          value={search}
                                          onChange={(e) => setSearch(e.target.value)}
                                          type="text"
                                          placeholder="Grocery Search..."
                                          className="w-full outline-none text-sm font-medium placeholder-gray-400"
                                   />
                            </form>
                     </motion.div>


                     {/* product */}
                     <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                            {filteredGrocery.map((item, index) => (
                                   <motion.div
                                          key={item._id}
                                          whileHover={{ scale: 1.02 }}
                                          initial={{
                                                 y: -80,
                                                 opacity: 0,
                                          }}
                                          animate={{
                                                 y: 0,
                                                 opacity: 1,
                                          }}
                                          transition={{
                                                 y: { type: "spring", stiffness: 180, damping: 10 },
                                                 delay: index * 0.1,
                                          }}
                                          style={{
                                                 transformOrigin: "top center",
                                          }}
                                          className="
                                          bg-linear-to-r from-green-50 via-green-50 to-orange-50 rounded-lg shadow p-4 flex flex-col items-center md:items-center md:flex-row justify-between gap-4"
                                   >
                                          {/* LEFT */}
                                          <div className="flex flex-col md:flex-row items-center gap-3">
                                                 <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className=" w-20 object-cover rounded-md"
                                                 />

                                                 {/* NAME + PRICE */}
                                                 <div className="text-center md:text-left">
                                                        <p className="text-sm font-semibold capitalize line-clamp-1">{item.name} / {item.unit}</p>
                                                        <p className="text-lg font-bold text-green-600">
                                                               ₹{item.price}
                                                        </p>
                                                 </div>
                                          </div>

                                          <button
                                                 className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer bg-green-500 gap-1 text-white hover:bg-orange-600 transition w-full md:w-auto flex items-center justify-center"
                                                 onClick={() => {
                                                        setSelectedItem(item);
                                                        reset({
                                                               name: item.name,
                                                               price: item.price,
                                                        });
                                                        setEditForm(true);
                                                 }}
                                          >
                                                 <img src="/edit.gif" className="h-5 w-5" />
                                                 Edit
                                          </button>
                                   </motion.div>
                            ))}
                     </div>


                     <AnimatePresence>
                            {editForm && (
                                   <motion.div
                                          initial={{ y: -100, opacity: 0 }}
                                          animate={{ y: 0, opacity: 1 }}
                                          exit={{ y: -100, opacity: 0 }}
                                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                                   >
                                          <motion.div
                                                 initial={{ scale: 0.9 }}
                                                 animate={{ scale: 1 }}
                                                 exit={{ scale: 0.9 }}
                                                 className="bg-white rounded-xl p-6 w-full max-w-md"
                                          >
                                                 <div className="flex justify-between">
                                                        <h2 className="font-bold text-lg mb-4 capitalize line-clamp-1">Edit Grocery</h2>
                                                        <img src="/cross.gif" className="h-6 w-6 cursor-pointer" onClick={() => setEditForm(false)} />
                                                 </div>

                                                 <form onSubmit={handleSubmit(onSubmit)}>
                                                        <input
                                                               {...register("name", {
                                                                      required: "Name is required",
                                                                      setValueAs: (v) => v.trim(),
                                                                      validate: (value) =>
                                                                             value.length > 0 || "Only spaces not allowed"
                                                               })}
                                                               className="w-full border p-2 rounded mb-2"
                                                               placeholder="Product name"
                                                        />
                                                        {errors.name && (
                                                               <p className="text-red-500 text-xs">{errors.name.message}</p>
                                                        )}

                                                        <input
                                                               type="number"
                                                               {...register("price", {
                                                                      required: "Price is required",
                                                                      min: { value: 1, message: "Price must be > 0" },
                                                               })}
                                                               className="w-full border p-2 rounded mb-2"
                                                               placeholder="Price"
                                                        />
                                                        {errors.price && (
                                                               <p className="text-red-500 text-xs">{errors.price.message}</p>
                                                        )}

                                                        <div className="flex justify-end gap-2 mt-3">
                                                               <button
                                                                      type="button"
                                                                      onClick={() => deleteGrocery(selectedItem._id)}
                                                                      className="cursor-pointer"
                                                               >
                                                                      <img src="/delete-1.gif" className="h-7 w-7" />
                                                               </button>

                                                               <button
                                                                      type="submit"
                                                                      disabled={isSubmitting}
                                                                      className="px-4 py-1 text-sm bg-green-500 text-white rounded cursor-pointer"
                                                               >
                                                                      {isSubmitting ? "Saving..." : "Save"}
                                                               </button>
                                                        </div>
                                                 </form>

                                          </motion.div>
                                   </motion.div>
                            )}
                     </AnimatePresence>

              </div>
       );
};

export default Page;



