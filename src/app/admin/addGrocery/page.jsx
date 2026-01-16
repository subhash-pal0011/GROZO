"use client"
import Link from "next/link";
import React, { useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useForm } from "react-hook-form"
import axios from "axios";
import { toast } from "sonner";

const AddGrocery = () => {
       const types = [
              "fruits",
              "vegetables",
              "dairy",
              "bakery",
              "snacks",
              "grains",
              "pulses",
              "spices",
              "oils",
              "meat",
              "seafood",
              "frozen_food",
              "instant_food",
              "organic",
              "household",
              "personal_care",
              "baby_care"
       ]
       const units = [
              "kg", "g", "liter", "ml", "piece", "pack"
       ]

       const {
              register,
              handleSubmit,
              reset,
              formState: { errors, isSubmitting },
       } = useForm()

       const [reviewImg, setReviewImg] = useState(null)

       const handleFileChange = (e) => {
              const file = e.target.files[0]
              if (!file) return
              const previewUrl = URL.createObjectURL(file)
              setReviewImg(previewUrl)
       }


       const onSubmit = async (data) => {
              try {
                     const formData = new FormData()
                     formData.append("name", data.name)
                     formData.append("types", data.types)
                     formData.append("unit", data.unit)
                     formData.append("price", data.price)

                     if (data.image && data.image[0]) {
                            formData.append("image", data.image[0])
                     }
                     const res = await axios.post("/api/admin/addGrocery",
                            formData,
                            {
                                   headers: {
                                          "Content-Type": "multipart/form-data",
                                   },
                            }
                     )
                     if (res.data.success) {
                            toast.success(res.data.message)
                            reset()
                            setReviewImg(null)
                     }
              } catch (error) {
                     console.log(`create gtocery error : ${error}`)
                     toast.error(error?.response?.data?.message)
              }
              console.log(data)
       }
       return (
              <div className="min-h-screen w-full flex items-center justify-center relative bg-gray-900 p-1">
                     <Link
                            href="/"
                            className="absolute md:top-4 top-0.5 left-4 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-orange-500 p-2"
                     >
                            <IoArrowBackSharp size={18} />
                            <span>Back</span>
                     </Link>

                     <div className="w-full max-w-md md:bg-gray-900 bg-gray-800 rounded-xl shadow-2xl p-6 ">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                   <IoIosAddCircleOutline size={22} className="text-green-500" />
                                   <p className="font-semibold text-lg">Add Your Grocery</p>
                            </div>

                            <p className="text-xs text-center text-gray-400 mb-6">
                                   Fill out the form below to add a new grocery item
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)}
                                   className="w-full space-y-4">
                                   <div className="flex flex-col gap-1">
                                          <label htmlFor="groceryName" className="text-sm font-medium">
                                                 Grocery Name <span className="text-red-500">*</span>
                                          </label>

                                          <input
                                                 id="groceryName"
                                                 type="text"
                                                 placeholder="eg: sweets, milk..."
                                                 className={`bg-gray-700 border border-gray-600 p-2 rounded-md outline-none focus:ring-1 focus:ring-orange-100 ${errors.category ? "border-red-500" : "border-gray-600"}`}
                                                 {...register("name", {
                                                        required: "Name is requierd", validate: (value) =>
                                                               value.trim().length > 0 || "Only spaces not allowed",
                                                 })}
                                          />
                                          {errors.name && (
                                                 <p className="text-red-500 text-xs">
                                                        {errors.name.message}
                                                 </p>
                                          )}
                                   </div>

                                   <div className="flex flex-col gap-1">
                                          <label htmlFor="types" className="text-sm font-medium">
                                                 Types <span className="text-red-500">*</span>
                                          </label>

                                          <select
                                                 id="types"
                                                 className={`bg-gray-700 border p-2 rounded-md outline-none
                                               focus:ring-1 focus:ring-orange-100 thin-scrollbar
                                               ${errors.types ? "border-red-500" : "border-gray-600"}`}
                                                 {...register("types", {
                                                        required: "Types is required",
                                                 })}
                                          >
                                                 <option value="">Select types</option>

                                                 {types.map((cat) => (
                                                        <option key={cat} value={cat}>
                                                               {cat}
                                                        </option>
                                                 ))}
                                          </select>

                                          {errors.types && (
                                                 <p className="text-red-500 text-xs">
                                                        {errors.types.message}
                                                 </p>
                                          )}
                                   </div>


                                   <div className="flex flex-col gap-1">
                                          <label htmlFor="unit" className="text-sm font-medium">
                                                 Unit <span className="text-red-500">*</span>
                                          </label>

                                          <select
                                                 id="unit"
                                                 className={`bg-gray-700 border p-2 rounded-md outline-none
                                                 focus:ring-1 focus:ring-orange-100
                                                 ${errors.unit ? "border-red-500" : "border-gray-600"}`}
                                                 {...register("unit", {
                                                        required: "Unit is required",
                                                 })}
                                          >
                                                 <option value="" className="bg-red-500 font-bold">Select units</option>
                                                 {units.map((unit, index) => (
                                                        <option key={unit} value={unit}>
                                                               {unit}
                                                        </option>
                                                 ))}

                                          </select>

                                          {errors.unit && (
                                                 <p className="text-red-500 text-xs">
                                                        {errors.unit.message}
                                                 </p>
                                          )}
                                   </div>

                                   <div className="flex flex-col gap-1">
                                          <label htmlFor="price" className="text-sm font-medium">
                                                 Price <span className="text-red-500">*</span>
                                          </label>

                                          <input
                                                 id="price"
                                                 type="number"
                                                 placeholder="eg: 120"
                                                 className={`bg-gray-700 border p-2 rounded-md outline-none
                                                 focus:ring-1 focus:ring-orange-100
                                                 ${errors.price ? "border-red-500" : "border-gray-600"} [&::-webkit-inner-spin-button]:appearance-none
                                                 [&::-webkit-outer-spin-button]:appearance-none
                                                 [-moz-appearance:textfield]`}

                                                 {...register("price", {
                                                        required: "Price is required",
                                                        min: {
                                                               value: 1,
                                                               message: "Price must be greater than 0",
                                                        },
                                                 })}
                                          />
                                          {errors.price && (
                                                 <p className="text-red-500 text-xs">{errors.price.message}</p>
                                          )}
                                   </div>

                                   <div className="flex flex-col gap-1">
                                          <div className="flex gap-5">
                                                 <label htmlFor="image" className="text-sm font-medium flex items-center cursor-pointer border w-30 p-1.5 rounded-sm bg-linear-to-r from-green-100 via-green-100 to-orange-100 text-gray-700 gap-1">
                                                        Select Img <img src="/photo.gif" alt="icon" className="h-7" />
                                                 </label>
                                                 {reviewImg && (
                                                        <img
                                                               src={reviewImg}
                                                               alt="preview"
                                                               className="h-14 w-14 shadow-sm shadow-gray-600 rounded-md object-cover border"
                                                        />
                                                 )}
                                          </div>

                                          <input
                                                 id="image"
                                                 type="file"
                                                 placeholder="eg: sweets, milk..."
                                                 className="bg-gray-700 border border-gray-600 p-2 rounded-md outline-none focus:ring-1 focus:ring-orange-100 hidden"
                                                 {...register("image", { required: "Image requierd", onChange: handleFileChange })}
                                          />
                                          {errors.image && (
                                                 <p className="text-red-500 text-xs">
                                                        {errors.image.message}
                                                 </p>
                                          )}
                                   </div>

                                   <button
                                          type="submit"
                                          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md duration-300 transition-all items-center cursor-pointer text-center justify-center flex"
                                          disabled={isSubmitting}
                                   >
                                          {isSubmitting ?
                                                 <img src="/loader.gif" className="h-8" alt="icon" /> : "Submit"
                                          }
                                   </button>
                            </form>
                     </div>
              </div>
       );
};

export default AddGrocery;



