"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { CiDeliveryTruck, CiLocationOn } from "react-icons/ci";
import dynamic from "next/dynamic";
const UpdateLocationForDeliveryBoy = dynamic(
       () => import("@/component/UpdateLocationForDeliveryBoy"),
       { ssr: false }
);


const Page = () => {
       const router = useRouter();
       const { orderId } = useParams();

       const [order, setOrder] = useState(null);
       const [userLocation, setUserLocation] = useState(null);
       const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);

       useEffect(() => {
              if (!orderId) return;

              const fetchOrder = async () => {
                     try {
                            const res = await axios.get(`/api/user/getTrackOrder/${orderId}`);

                            if (res.data.success) {
                                   const data = res.data.data;
                                   setOrder(data);

                                   // USER location (map purpose)
                                   setUserLocation({
                                          latitude: data?.address?.latitude,
                                          longitude: data?.address?.longitude,
                                   });

                                   // DELIVERY BOY location (map purpose)
                                   setDeliveryBoyLocation({
                                          longitude:
                                                 data?.orderAssignd?.deliveryBoyId?.location?.coordinates?.[0],
                                          latitude:
                                                 data?.orderAssignd?.deliveryBoyId?.location?.coordinates?.[1],
                                   });
                            }

                     } catch (error) {
                            console.log("Track order error:", error);
                     }
              };

              fetchOrder();
       }, [orderId]);


       const deliveryBoy = order?.orderAssignd?.deliveryBoyId;

       return (
              <div className="min-h-screen w-full bg-linear-to-r from-green-100 via-green-100 to-orange-100 text-gray-700">

                     <div className="flex items-center gap-2 p-4">
                            <button
                                   onClick={() => router.back()}
                                   className="flex items-center gap-1 hover:text-black"
                            >
                                   <IoMdArrowBack size={22} />
                                   <span className="text-sm font-semibold">Back</span>
                            </button>
                     </div>


                     <div className="max-w-2xl mx-auto px-4">
                            <div className="bg-white rounded shadow-lg p-5 space-y-5">

                                   <div>
                                          <p className="text-xs text-gray-500">Order ID</p>
                                          <p className="text-xs font-semibold break-all">{orderId}</p>
                                   </div>

                                   <hr />

                                   <div className="flex items-start gap-3">
                                          <CiLocationOn size={22} className="text-green-600 mt-1" />
                                          <div>
                                                 <p className="text-sm font-semibold">Delivery Address</p>
                                                 <p className="text-xs text-gray-600 capitalize line-clamp-2">
                                                        {order?.address?.fullAddress || "Address not available"}
                                                 </p>
                                          </div>
                                   </div>

                                   <div className="flex items-start gap-3">
                                          <CiDeliveryTruck size={22} className="text-yellow-600 mt-1" />
                                          <div>
                                                 <p className="text-sm font-semibold">Delivery Partner</p>
                                                 {deliveryBoy ? (
                                                        <div className="flex md:flex-row flex-col md:gap-3">
                                                               <p className="text-xs text-gray-600 capitalize line-clamp-1">
                                                                      Name: {deliveryBoy?.name}
                                                               </p>
                                                               <p className="text-xs text-gray-600">
                                                                      Mobile: {deliveryBoy?.mobile}
                                                               </p>
                                                        </div>
                                                 ) : (
                                                        <p className="text-xs text-red-500">
                                                               Delivery partner not assigned yet
                                                        </p>
                                                 )}
                                          </div>
                                   </div>
                            </div>

                            {/* Map placeholder */}
                            <div className="mt-6 bg-white rounded-xl shadow text-center text-sm text-gray-500">
                                   <UpdateLocationForDeliveryBoy
                                          orderLocation={userLocation}
                                          deliveryBoyLocation={deliveryBoyLocation}
                                   />
                            </div>
                     </div>
              </div>
       );
};

export default Page;
