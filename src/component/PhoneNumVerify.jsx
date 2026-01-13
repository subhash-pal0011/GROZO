"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";


const PhoneNumVerify = ({ mobile }) => {
       const {
              register,
              handleSubmit,
              formState: { isSubmitting },
       } = useForm();

       const router = useRouter()

       const onSubmit = async (data) => {
              try {
                     const res = await axios.post("/api/otp/verifyOtp", {
                            mobile,
                            otp: data.otp.join(""),//🧠 👉 “OTP inputs frontend pe array me milte hain kucch is type-- ["1","2","3","4","5","6"], lekin Twilio string expect karta hai, isliye hum array ko .join("") se string me convert karke bhejte hain.”
                     });

                     if (res.data.success) {
                            toast.success("Your Mobile verified 🎉");
                            router.refresh(); //🧠 isse page relod ho jyega
                     }
              }
              catch {
                     toast.error("Invalid OTP");
              }
       };
       return (
              <div className="min-h-screen w-full flex flex-col justify-center items-center">
                     <motion.img
                            initial={{
                                   y: -40, opacity: 0
                            }}
                            animate={{
                                   y: 0, opacity: 1
                            }}
                            transition={{
                                   delay: 0.3, duration: 0.8
                            }}

                            src="/grozo.png" alt="logo" className="h-30"
                     />
                     <motion.form
                            initial={{
                                   y: 40, opacity: 0
                            }}
                            animate={{
                                   y: 0, opacity: 1
                            }}
                            transition={{
                                   delay: 0.3, duration: 0.8
                            }}
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col items-center space-y-5"
                     >
                            <div className="flex gap-3">
                                   {Array.from({ length: 6 }).map((_, index) => (
                                          <input
                                                 key={index}
                                                 type="text"
                                                 maxLength={1}
                                                 inputMode="numeric"
                                                 className="w-12 h-12 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                 {...register(`otp.${index}`, {
                                                        required: true,
                                                        pattern: /^[0-9]$/,
                                                 })}
                                                 onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                        if (e.target.nextSibling && e.target.value) {
                                                               e.target.nextSibling.focus();
                                                        }
                                                 }}
                                          />
                                   ))}
                            </div>

                            <button
                                   disabled={isSubmitting}
                                   type="submit"
                                   className="cursor-pointer bg-green-600 text-white px-6 py-2 rounded"
                            >
                                   {isSubmitting ? <ClipLoader size={20} color="white" /> : "Verify OTP"}
                            </button>
                     </motion.form>

              </div>

       );
};

export default PhoneNumVerify;


