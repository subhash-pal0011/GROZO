"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdOutlineDirectionsBike } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

const PhoneNumRole = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter()

  const roles = [
    // id MTLB JI MODEL MEA LIKHE HO VO VALA LIKHNA HII, LABEL MTLB JO FORNTEND MEA DIKHANA CHATE HI ICON BHI DIKHNA HII TO ICON BHI.
    { id: "admin", label: "Admin", icon: "/admin.gif" },
    { id: "user", label: "User", icon: "/avatar.gif" },
    { id: "delivery", label: "Delivery", icon: <MdOutlineDirectionsBike size={58} /> },
  ];

  const sendOtp = async (mobile) => {
    await axios.post("/api/otp/sendOtpSms", { mobile });
  };


  const onSubmit = async (data) => {
    if (!selectedRole) {
      toast.error("Please select a Role");
      return;
    }
    try {
      const res = await axios.post("/api/user/editProfile", { ...data, role: selectedRole });
      if (res.data.success) {
        await sendOtp(data.mobile)
        toast.success("Profile updated successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("Edit profile error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center space-y-10 px-4">

      <motion.h1
        className="md:text-2xl text-green-700 font-bold flex items-center justify-center md:gap-2 gap-1"
        initial={{
          y: -40, opacity: 0
        }}
        animate={{
          y: 0, opacity: 1
        }}
        transition={{
          delay: 0.3, duration: 0.8
        }}
      >
        Select Your Role
        <img src="/edit.gif" alt="icon" className="h-10 w-10" />
      </motion.h1>

      <motion.div
        initial={{

          x: -40, opacity: 0
        }}
        animate={{
          x: 0, opacity: 1
        }}
        transition={{
          delay: 0.3, duration: 0.8
        }}
        className="flex flex-col md:flex-row gap-4"
      >
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <motion.div
              key={role.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => setSelectedRole(role.id)}
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer shadow-md transition
                ${isSelected && "bg-green-500"} shadow-md shadow-blue-950`}

            >
              {typeof role.icon === "string" ? (
                <img src={role.icon} alt={role.label} className="w-16 h-16 object-contain" />
              ) : (
                role.icon
              )}
              <span className="text-lg font-medium">{role.label}</span>
            </motion.div>
          );
        })}
      </motion.div>

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
        className="flex flex-col space-y-5 items-center w-full"
      >
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter Phone Number"
          className="p-2 border w-full max-w-md rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
          {...register("mobile", {
            required: "Number is required",
            minLength: {
              value: 10,
              message: "Number must be 10 digits",
            },
            maxLength: {
              value: 10,
              message: "Number must be 10 digits",
            },
            pattern: {
              value: /^[0-9]+$/,
              message: "Only numbers allowed",
            },
          })}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
        />
        

        <button
          disabled={isSubmitting}
          className="w-full max-w-md p-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
        >
          {/* {isSubmitting ? "Submitting..." : "Submit"} */}
          {isSubmitting ? <ClipLoader size={20} color="white" /> : "Submit"}
        </button>
      </motion.form>
    </div>
  );
};

export default PhoneNumRole;






// "use client";
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { MdOutlineDirectionsBike } from "react-icons/md";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { toast } from "sonner";

// const PhoneNumRole = () => {
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
//   const [selectedRole, setSelectedRole] = useState("");

//   const roles = [
//     { id: "admin", label: "Admin", icon: "/admin.gif" },
//     { id: "user", label: "User", icon: "/avatar.gif" },
//     { id: "delivery", label: "Delivery", icon: <MdOutlineDirectionsBike size={58} /> },
//   ];

//   const sendOtp = async (mobile) => {
//     await axios.post("/api/otp/sendOtpSms", { mobile });
//   };

//   const onSubmit = async (data) => {
//     if (!selectedRole) {
//       toast.error("Please select a role");
//       return;
//     }

//     try {
//       const res = await axios.post("/api/user/editProfile", {
//         mobile: data.mobile,
//         role: selectedRole,
//       });

//       if (res.data.success) {
//         toast.success("Profile updated");
//         await sendOtp(data.mobile);
//         window.location.reload();
//       }
//     } catch (err) {
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center gap-8">
//       <motion.h1 className="text-2xl font-bold text-green-600">
//         Select Your Role
//       </motion.h1>

//       <div className="flex gap-4">
//         {roles.map((role) => (
//           <div
//             key={role.id}
//             onClick={() => setSelectedRole(role.id)}
//             className={`p-4 border rounded cursor-pointer ${selectedRole === role.id && "bg-green-500 text-white"
//               }`}
//           >
//             {typeof role.icon === "string" ? (
//               <img src={role.icon} className="h-16 w-16" />
//             ) : (
//               role.icon
//             )}
//             <p>{role.label}</p>
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//         <input
//           placeholder="Enter mobile"
//           {...register("mobile", {
//             required: true,
//             minLength: 10,
//             maxLength: 10,
//             pattern: /^[0-9]+$/,
//           })}
//           className="border p-2 rounded"
//         />
//         {errors.mobile && <p className="text-red-500 text-sm">Invalid number</p>}

//         <button disabled={isSubmitting} className="bg-green-600 text-white p-2 rounded">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PhoneNumRole;
