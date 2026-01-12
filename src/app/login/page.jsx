// "use client";
// import React, { useState } from "react";
// import { IoMdArrowBack } from "react-icons/io";
// import { MdOutlineEmail } from "react-icons/md";
// import { useForm } from "react-hook-form";
// import { FaRegEye } from "react-icons/fa";
// import { IoEyeOffOutline } from "react-icons/io5";
// import { FcGoogle } from "react-icons/fc";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { toast } from "sonner"
// import { ClipLoader } from "react-spinners";
// import { FiLogIn } from "react-icons/fi";
// import { signIn } from "@/auth";


// const Login = () => {
//        const [showPassword, setShowPassword] = useState(false)
//        const router = useRouter()
//        const {
//               register,
//               handleSubmit,
//               watch,
//               reset,
//               formState: { errors, isSubmitting },
//        } = useForm();

//        const password = watch("password");

//        const onSubmit = async (data) => {
//               try {
//                      await signIn("credentials",{
//                             email,
//                             password
//                      })
//               } catch (error) {
//                      console.log(`login error : ${error}`)
//               }
//               console.log(data)
//        };


//        return (
//               <div className="w-full h-screen items-center text-center justify-center flex flex-col">
//                      <div className="absolute -top-1  md:left-3 -left-5 flex items-center gap-1 mb-6 cursor-pointer text-gray-300 p-10">
//                             <IoMdArrowBack onClick={() => router.push("/")}
//                                    size={25} className="hover:text-green-500 hover:scale-125 transition-all duration-300" />
//                             <span className="text-sm text-green-500">Back</span>
//                      </div>
//                      <div className="w-full md:max-w-1/2 space-y-5 p-2">
//                             <div className="space-y-1.5">
//                                    <h2 className="text-green-500 text-2xl font-semibold">
//                                           Welcome Back
//                                    </h2>
//                                    <p className="text-sm text-gray-400">
//                                           Login with Grozo
//                                    </p>
//                             </div>
//                             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

//                                    <div className="relative">
//                                           <span className="absolute left-3 top-3">
//                                                  <MdOutlineEmail className="text-[#109121]" />
//                                           </span>
//                                           <input
//                                                  type="email"
//                                                  placeholder="Enter your Email"
//                                                  className="w-full pl-10 py-2 rounded-xl bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"

//                                                  {...register("email", {
//                                                         required: "Email is required",
//                                                         validate: (value) =>
//                                                                value.trim().length > 0 || "Only spaces not allowed",
//                                                  })}
//                                           />
//                                           {errors.email && (
//                                                  <p className="text-red-500 text-xs mt-1">
//                                                         {errors.email.message}
//                                                  </p>
//                                           )}
//                                    </div>
//                                    <div className="relative">
//                                           <span className="absolute left-3 top-1/2 -translate-y-1/2">
//                                                  <img src="/eye.gif" alt="icon" className="h-5 w-5" />
//                                           </span>

//                                           <input
//                                                  type={showPassword ? "text" : "password"}
//                                                  placeholder="Enter Password"
//                                                  className="w-full pl-10 pr-10 py-2 rounded-xl bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
//                                                  {...register("password", {
//                                                         required: "Password is required",
//                                                         validate: (value) =>
//                                                                value.trim().length > 0 || "Only spaces not allowed",
//                                                  })}
//                                           />
//                                           {password &&
//                                                  <span
//                                                         onClick={() => setShowPassword(!showPassword)}
//                                                         className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-green-500 transition"
//                                                  >
//                                                         {showPassword ? <FaRegEye /> : <IoEyeOffOutline />}
//                                                  </span>
//                                           }
//                                    </div>

//                                    {errors.password && (
//                                           <p className="text-red-500 text-xs mt-1">
//                                                  {errors.password.message}
//                                           </p>
//                                    )}

//                                    <button
//                                           disabled={isSubmitting}
//                                           type="submit"
//                                           className="w-full py-1.5 rounded-xl font-semibold bg-green-600 hover:bg-green-700 transition-all duration-300 cursor-pointer"
//                                    >
//                                           {isSubmitting ? <ClipLoader size={20} color="white" /> : "Create Account"}
//                                    </button>

//                             </form>

//                             <div className="flex items-center text-center gap-3">
//                                    <div className="flex-1 h-px bg-gray-400"></div>
//                                    <span className="text-sm text-gray-400">OR</span>
//                                    <div className="flex-1 h-px bg-gray-400"></div>
//                             </div>

//                             <div className="items-center text-center justify-center flex">
//                                    <button className="flex items-center gap-2 border p-2 px-5 rounded cursor-pointer">
//                                           <FcGoogle /> <p className="font-semibold text-sm">continew with google</p>
//                                    </button>
//                             </div>

//                             <div className="flex items-center justify-center mx-auto gap-1 text-center">
//                                    <p className="text-sm">Don’t have an account?</p>
//                                    <FiLogIn />
//                                    <button
//                                           type="button"
//                                           //🧠 router.back() YE browser history ke liye hota hai
//                                           onClick={() => router.back()}
//                                           className="text-green-500 font-semibold cursor-pointer"
//                                    >
//                                           register
//                                    </button>
//                             </div>
//                      </div>
//               </div>
//        );
// };

// export default Login;

"use client";
import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
import { FaRegEye } from "react-icons/fa";
import { IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { FiLogIn } from "react-icons/fi";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";

const Login = () => {
       const [showPassword, setShowPassword] = useState(false);
       const router = useRouter();

       const session = useSession();
       console.log("Session object:", session);
       console.log("User:", session.data?.user);
       console.log("Status:", session.status);

       const {
              register,
              handleSubmit,
              watch,
              reset,
              formState: { errors, isSubmitting },
       } = useForm();

       const password = watch("password");

       // ISSE FORM KE TRUGH JYEGA DATA
       const onSubmit = async (data) => {
              try {
                     const res = await signIn("credentials", {data});

                     if (res?.error) {
                            toast.error(res.error);
                            return;
                     }

                     toast.success("Login successful 🎉");
                     reset();
                     // router.push("/dashboard"); // change if needed
              } catch (error) {
                     console.log("Login error:", error);
                     toast.error("Something went wrong");
              }
       };


       return (
              <div className="w-full h-screen flex items-center justify-center">
                     <div className="absolute top-3 left-3 flex items-center gap-1 cursor-pointer">
                            <IoMdArrowBack
                                   onClick={() => router.push("/")}
                                   size={25}
                                   className="text-gray-300 hover:text-green-500 hover:scale-125 transition"
                            />
                            <span className="text-sm text-green-500">Back</span>
                     </div>

                     <motion.div
                            initial={{
                                   x: 40,
                                   opacity: 0,
                            }}
                            animate={{
                                   x: 0,
                                   opacity: 1,
                            }}
                            transition={{
                                   delay: 0.3,
                                   duration: 0.8,
                            }}

                            className="w-full max-w-lg space-y-5 p-1">
                            <div className="space-y-1.5 text-center">
                                   <h2 className="text-green-500 text-2xl font-semibold">
                                          Welcome Back
                                   </h2>
                                   <p className="text-sm text-gray-400">
                                          Login with Grozo
                                   </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                   <div className="relative">
                                          <span className="absolute left-3 top-3">
                                                 <MdOutlineEmail className="text-green-500" />
                                          </span>
                                          <input
                                                 type="email"
                                                 placeholder="Enter your Email"
                                                 className="w-full pl-10 py-2 rounded-xl bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                 {...register("email", {
                                                        required: "Email is required",
                                                 })}
                                          />
                                          {errors.email && (
                                                 <p className="text-red-500 text-xs mt-1">
                                                        {errors.email.message}
                                                 </p>
                                          )}
                                   </div>

                                   <div className="relative">
                                          <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                                 <img src="/eye.gif" alt="icon" className="h-5 w-5" />
                                          </span>

                                          <input
                                                 type={showPassword ? "text" : "password"}
                                                 placeholder="Enter Password"
                                                 className="w-full pl-10 pr-10 py-2 rounded-xl bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                 {...register("password", {
                                                        required: "Password is required",
                                                        validate: (value) =>
                                                               value.trim().length > 0 || "Only spaces not allowed",
                                                 })}
                                          />
                                          {password &&
                                                 <span
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-green-500 transition"
                                                 >
                                                        {showPassword ? <FaRegEye /> : <IoEyeOffOutline />}
                                                 </span>
                                          }
                                   </div>
                                   {errors.password && (
                                          <p className="text-red-500 text-xs mt-1">
                                                 {errors.password.message}
                                          </p>
                                   )}

                                   <button
                                          disabled={isSubmitting}
                                          type="submit"
                                          className="w-full py-2 rounded-xl font-semibold bg-green-600 hover:bg-green-700 transition cursor-pointer"
                                   >
                                          {isSubmitting ? (
                                                 <ClipLoader size={20} color="white" />
                                          ) : (
                                                 "Login"
                                          )}
                                   </button>
                            </form>

                            <div className="flex items-center gap-3">
                                   <div className="flex-1 h-px bg-gray-400"></div>
                                   <span className="text-sm text-gray-400">OR</span>
                                   <div className="flex-1 h-px bg-gray-400"></div>
                            </div>

                            <div className="flex justify-center">
                                   <button onClick={()=>signIn("google")}
                                   className="flex items-center gap-2 border p-2 px-5 rounded hover:bg-white/5 cursor-pointer">
                                          <FcGoogle />
                                          <span className="font-semibold text-sm">
                                                 Continue with Google
                                          </span>
                                   </button>
                            </div>

                            <div className="flex items-center justify-center gap-1">
                                   <p className="text-xs">Don’t have an account?</p>
                                   <FiLogIn />
                                   <button
                                          type="button"
                                          onClick={() => router.back()}
                                          className="text-green-500 font-semibold cursor-pointer"
                                   >
                                          Register
                                   </button>
                            </div>
                     </motion.div>
              </div>
       );
};
export default Login;
