"use client";
import { getSocket } from "@/lib/socket";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import MessageForDelivery from "./MessageForDelivery";
const UpdateLocationForDeliveryBoy = dynamic(
  () => import("./UpdateLocationForDeliveryBoy"),
  { ssr: false }
);


const DeliveryBoyDashboard = () => {
  const [data, setData] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderLocation, setOrderLocation] = useState(null);
  console.log("activeOrder :", activeOrder)
  console.log("orderLocation : ", orderLocation)
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);







  useEffect(() => {
    if (!userId) return;
    getSocket().emit("join", userId);
  }, [userId]);


  useEffect(() => {
    const getOrder = async () => {
      const active = await axios.get("/api/delivery/getAcceptOrder");
      if (active.data.success && active.data.data) {
        setActiveOrder(active.data.data);
        setData([]);
        return;
      }
      const res = await axios.get("/api/delivery/getDeliveryAssignment");
      setData(res.data.data || []);
    };
    getOrder();
  }, []);


  // REAL TIME NOTIFICATION GET
  useEffect(() => {
    const socket = getSocket();
    const handleNewOrderAssign = (assignment) => {
      if (activeOrder) return;
      setData((prev) => [assignment, ...prev]);
    };
    socket.on("new-order-assign", handleNewOrderAssign);
    return () => socket.off("new-order-assign", handleNewOrderAssign);
  }, [activeOrder]);



  const handelAcceptOrder = async (id) => {
    try {
      const res = await axios.get(`/api/delivery/assignment/accept/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setActiveOrder(res.data.data);
        setData([]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };



  useEffect(() => {
    if (activeOrder?.orderId?.address && !orderLocation) {
      setOrderLocation({
        latitude: activeOrder.orderId.address.latitude,
        longitude: activeOrder.orderId.address.longitude,
      });
    }
  }, [activeOrder]);


  //LIVE LOCATION (ONLY AFTER ACCEPT)
  useEffect(() => {  // YE DEGA LIVE LOCATION DELIVERY BOY KI.
    const socket = getSocket();

    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        setDeliveryBoyLocation({ latitude, longitude });

        socket.emit("update-location", {
          userId,
          location: {
            type: "Point",
            coordinates: [longitude, latitude], // 🧠 PAHLE longitude KYUKI JB STATUS CONFERM KROGE TO TUMHRE ORDER SE JITNE 10KM MEA DELIVERY BOY RHENGE UNKE PASS NOTIFICATION JYEGA ORDER PUCHANE KE LIYE 
          },
        });
      },
      (error) => {
        console.log("Location error:", error);
      },
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);



  const sendOtpForOrder = async () => {
    try {
      const res = await axios.post("/api/otp/orderOtpSend", {
        orderId: activeOrder?.orderId?._id,
      });

      if (res.data.success) {
        toast.success("OTP sent to customer");
        setShowOtpBox(true);
      }
    } catch (error) {
      toast.error("OTP send failed");
    }
  };


  const verifyOtpForOrder = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      setVerifying(true);

      const res = await axios.post("/api/otp/veryifyOtpForOrder", {
        orderId: activeOrder?.orderId?._id,
        otp,
      });

      if (res.data.success) {
        toast.success("Order Delivered Successfully");

        //  VERIFY HONE KE BAD MTLB ORDER PUCCH GYA HII TO SB EMPTY KR DO
        setActiveOrder(null);
        setOrderLocation(null);
        setDeliveryBoyLocation(null);
        setShowOtpBox(false);
        setOtp("");
      }
      else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };


  if (activeOrder && orderLocation) {
    return (
      <div className="min-h-screen p-2 bg-linear-to-r from-green-100 via-green-100 to-orange-100">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">

          {/* MAP */}
          <div className="w-full md:w-1/2">
            <div className="p-2 shadow-2xl bg-white rounded-xl ">
              <h1 className="text-center text-green-500 text-lg font-semibold mb-2">
                Active Order
              </h1>

              <UpdateLocationForDeliveryBoy
                orderLocation={orderLocation}
                deliveryBoyLocation={deliveryBoyLocation}
              />
            </div>
          </div>

          {/* CHAT */}
          <div className="w-full md:w-1/2">
            <MessageForDelivery
              orderId={activeOrder?.orderId?._id}
              deliveryBoyId={userId}
            />
          </div>
        </div>


        <div className="flex justify-center mt-6">
          {!showOtpBox ? (
            !activeOrder?.orderId?.deliveryVerification && (
              <button
                onClick={sendOtpForOrder}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-green-500 to-emerald-600  text-white text-sm font-bold shadow-lg shadow-green-300/50 hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 ">
                <img src="/check.gif" className="h-5 w-5" />
                Mark as Delivered
              </button>
            )
          ) : (
            <div className="flex flex-col items-center gap-3 bg-white px-6 py-5 rounded-2xl shadow-xl w-fit mx-auto">

              <p className="text-sm font-semibold text-gray-700">
                Enter Delivery OTP
              </p>

              <input
                type="text"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className="w-40 text-center text-lg tracking-widest font-bold border-2 border-gray-300 rounded-lg py-2 focus:outline-none focus:border-green-500  transition text-gray-700" />

              <button
                onClick={verifyOtpForOrder}
                disabled={verifying || otp.length < 6}
                className="cursor-pointer w-full py-2.5 rounded-full text-sm font-bold text-white  bg-linear-to-r from-blue-500 to-indigo-600 shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                {verifying ? "Verifying OTP..." : "Verify & Complete Delivery"}
              </button>

              <p className="text-xs text-gray-400">
                OTP sent to customer’s mobile number
              </p>
            </div>

          )}
        </div>
      </div>

    );
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-r from-green-100 via-green-100 to-orange-100 text-gray-800 flex flex-col items-center justify-center md:p-5 p-2">

      {data.length === 0 ? (
        <div className="flex md:flex-row flex-col items-center">
          <img src="/computer.gif" className="h-20 w-20" />
          <p className="font-bold text-xl text-gray-500 capitalize line-clamp-1">No assignments</p>
        </div>
      ) : (
        data.map((item) => (
          <div
            key={item?._id}
            className="w-full max-w-xl mb-4 p-4 bg-linear-to-r from-blue-100 via-green-100 to-orange-100 border rounded shadow-sm space-y-2"
          >
            {/* Desktop – full order id */}
            <div className="hidden lg:flex items-center gap-1">
              <p className="font-semibold text-sm">Order Id</p>
              <span>:</span>
              <p className="text-xs font-semibold text-gray-600">
                {item.orderId?._id}
              </p>
            </div>

            {/* Mobile – short order id */}
            <div className="flex lg:hidden items-center gap-1">
              <p className="font-semibold text-sm">Order Id</p>
              <span>:</span>
              <p className="text-xs font-semibold text-gray-600">
                {item.orderId?._id?.slice(-5)}
              </p>
            </div>


            <div className="flex items-center gap-1">
              <p className="font-semibold text-sm ">Order Addres</p> {":"} <p className="text-xs font-semibold text-gray-600 capitalize line-clamp-2">{item?.orderId?.address?.fullAddress}</p>
            </div>

            <div className="flex md:flex-row flex-col md:gap-5 gap-2">
              <button onClick={() => handelAcceptOrder(item?._id)}
                className="border w-full p-1 py-2 text-sm font-semibold border-green-500 hover:bg-green-500 hover:text-gray-100 transition-all duration-300 cursor-pointer">Accept</button>

              <button className="border w-full p-1 py-2 text-sm font-semibold border-red-500 hover:border-gray-400 hover:bg-red-500 hover:text-gray-100 transition-all duration-300 cursor-pointer">Reject</button>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default DeliveryBoyDashboard;

















// "use client";
// import { getSocket } from "@/lib/socket";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
// import dynamic from "next/dynamic";
// import MessageForDelivery from "./MessageForDelivery";
// const UpdateLocationForDeliveryBoy = dynamic(
//   () => import("./UpdateLocationForDeliveryBoy"),
//   { ssr: false }
// );


// const DeliveryBoyDashboard = () => {
//   const [data, setData] = useState([]);
//   const [activeOrder, setActiveOrder] = useState(null);
//   const [orderLocation, setOrderLocation] = useState(null);
//   console.log("activeOrder :", activeOrder)
//   console.log("orderLocation : ", orderLocation)
//   const { data: session } = useSession();
//   const userId = session?.user?.id;
//   const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
//   const [showOtpBox, setShowOtpBox] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [verifying, setVerifying] = useState(false);







//   useEffect(() => {
//     if (!userId) return;
//     getSocket().emit("join", userId);
//   }, [userId]);


//   useEffect(() => {
//     const getOrder = async () => {
//       const active = await axios.get("/api/delivery/getAcceptOrder");
//       if (active.data.success && active.data.data) {
//         setActiveOrder(active.data.data);
//         setData([]);
//         return;
//       }
//       const res = await axios.get("/api/delivery/getDeliveryAssignment");
//       setData(res.data.data || []);
//     };
//     getOrder();
//   }, []);


//   // REAL TIME NOTIFICATION GET
//   useEffect(() => {
//     const socket = getSocket();
//     const handleNewOrderAssign = (assignment) => {
//       if (activeOrder) return;
//       setData((prev) => [assignment, ...prev]);
//     };
//     socket.on("new-order-assign", handleNewOrderAssign);
//     return () => socket.off("new-order-assign", handleNewOrderAssign);
//   }, [activeOrder]);



//   const handelAcceptOrder = async (id) => {
//     try {
//       const res = await axios.get(`/api/delivery/assignment/accept/${id}`);
//       if (res.data.success) {
//         toast.success(res.data.message);
//         setActiveOrder(res.data.data);
//         setData([]);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message);
//     }
//   };



//   useEffect(() => {
//     if (activeOrder?.orderId?.address &&!orderLocation) {
//       setOrderLocation({
//         latitude: activeOrder.orderId.address.latitude,
//         longitude: activeOrder.orderId.address.longitude,
//       });
//     }
//   }, [activeOrder]);


//   //LIVE LOCATION (ONLY AFTER ACCEPT)
//   useEffect(() => {  // YE DEGA LIVE LOCATION DELIVERY BOY KI.
//     const socket = getSocket();

//     if (!navigator.geolocation) return;

//     const watcher = navigator.geolocation.watchPosition(
//       (pos) => {
//         const latitude = pos.coords.latitude;
//         const longitude = pos.coords.longitude;

//         setDeliveryBoyLocation({ latitude, longitude });

//         socket.emit("update-location", {
//           userId,
//           location: {
//             type: "Point",
//             coordinates: [longitude, latitude], // 🧠 PAHLE longitude KYUKI JB STATUS CONFERM KROGE TO TUMHRE ORDER SE JITNE 10KM MEA DELIVERY BOY RHENGE UNKE PASS NOTIFICATION JYEGA ORDER PUCHANE KE LIYE
//           },
//         });
//       },
//       (error) => {
//         console.log("Location error:", error);
//       },
//       { enableHighAccuracy: true }
//     );
//     return () => navigator.geolocation.clearWatch(watcher);
//   }, []);



//   const sendOtpForOrder = async () => {
//     try {
//       const res = await axios.post("/api/otp/orderOtpSend", {
//         orderId: activeOrder?.orderId?._id,
//       });

//       if (res.data.success) {
//         toast.success("OTP sent to customer");
//         setShowOtpBox(true);
//       }
//     } catch (error) {
//       toast.error("OTP send failed");
//     }
//   };


//   const verifyOtpForOrder = async () => {
//     if (!otp) return toast.error("Enter OTP");

//     try {
//       setVerifying(true);

//       const res = await axios.post("/api/otp/veryifyOtpForOrder", {
//         orderId: activeOrder?.orderId?._id,
//         otp,
//       });

//       if (res.data.success) {
//         toast.success("Order Delivered Successfully");
//         setShowOtpBox(false);
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       toast.error("Invalid OTP");
//     } finally {
//       setVerifying(false);
//     }
//   };


//   if (activeOrder && orderLocation) {
//     return (
//       <div className="min-h-screen p-2 bg-linear-to-r from-green-100 via-green-100 to-orange-100">
//         <div className="flex flex-col md:flex-row gap-4 items-stretch">

//           {/* MAP */}
//           <div className="w-full md:w-1/2">
//             <div className="p-2 shadow-2xl bg-white rounded-xl ">
//               <h1 className="text-center text-green-500 text-lg font-semibold mb-2">
//                 Active Order
//               </h1>

//               <UpdateLocationForDeliveryBoy
//                 orderLocation={orderLocation}
//                 deliveryBoyLocation={deliveryBoyLocation}
//               />
//             </div>
//           </div>

//           {/* CHAT */}
//           <div className="w-full md:w-1/2">
//             <MessageForDelivery
//               orderId={activeOrder?.orderId?._id}
//               deliveryBoyId={userId}
//             />
//           </div>
//         </div>


//         <div className="flex justify-center mt-6">
//           {!showOtpBox ? (
//             !activeOrder?.orderId?.deliveryVerification && (
//               <button
//                 onClick={sendOtpForOrder}
//                 className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-green-500 to-emerald-600  text-white text-sm font-bold shadow-lg shadow-green-300/50 hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 ">
//                 <img src="/check.gif" className="h-5 w-5" />
//                 Mark as Delivered
//               </button>
//             )
//           ) : (
//             <div className="flex flex-col items-center gap-3 bg-white px-6 py-5 rounded-2xl shadow-xl w-fit mx-auto">

//               <p className="text-sm font-semibold text-gray-700">
//                 Enter Delivery OTP
//               </p>

//               <input
//                 type="text"
//                 value={otp}
//                 maxLength={6}
//                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//                 placeholder="••••••"
//                 className="w-40 text-center text-lg tracking-widest font-bold border-2 border-gray-300 rounded-lg py-2 focus:outline-none focus:border-green-500  transition text-gray-700" />

//               <button
//                 onClick={verifyOtpForOrder}
//                 disabled={verifying || otp.length < 6}
//                 className="cursor-pointer w-full py-2.5 rounded-full text-sm font-bold text-white  bg-linear-to-r from-blue-500 to-indigo-600 shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
//                 {verifying ? "Verifying OTP..." : "Verify & Complete Delivery"}
//               </button>

//               <p className="text-xs text-gray-400">
//                 OTP sent to customer’s mobile number
//               </p>
//             </div>

//           )}
//         </div>
//       </div>

//     );
//   }

//   return (
//     <div className="min-h-screen w-full bg-linear-to-r from-green-100 via-green-100 to-orange-100 text-gray-800 flex flex-col items-center justify-center md:p-5 p-2">

//       {data.length === 0 ? (
//         <p>No assignments</p>
//       ) : (
//         data.map((item) => (
//           <div
//             key={item?._id}
//             className="w-full max-w-xl mb-4 p-4 bg-linear-to-r from-blue-100 via-green-100 to-orange-100 border rounded shadow-sm space-y-2"
//           >
//             {/* Desktop – full order id */}
//             <div className="hidden lg:flex items-center gap-1">
//               <p className="font-semibold text-sm">Order Id</p>
//               <span>:</span>
//               <p className="text-xs font-semibold text-gray-600">
//                 {item.orderId?._id}
//               </p>
//             </div>

//             {/* Mobile – short order id */}
//             <div className="flex lg:hidden items-center gap-1">
//               <p className="font-semibold text-sm">Order Id</p>
//               <span>:</span>
//               <p className="text-xs font-semibold text-gray-600">
//                 {item.orderId?._id?.slice(-5)}
//               </p>
//             </div>


//             <div className="flex items-center gap-1">
//               <p className="font-semibold text-sm ">Order Addres</p> {":"} <p className="text-xs font-semibold text-gray-600 capitalize line-clamp-2">{item?.orderId?.address?.fullAddress}</p>
//             </div>

//             <div className="flex md:flex-row flex-col md:gap-5 gap-2">
//               <button onClick={() => handelAcceptOrder(item?._id)}
//                 className="border w-full p-1 py-2 text-sm font-semibold border-green-500 hover:bg-green-500 hover:text-gray-100 transition-all duration-300 cursor-pointer">Accept</button>

//               <button className="border w-full p-1 py-2 text-sm font-semibold border-red-500 hover:border-gray-400 hover:bg-red-500 hover:text-gray-100 transition-all duration-300 cursor-pointer">Reject</button>
//             </div>

//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default DeliveryBoyDashboard;