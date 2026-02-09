"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const containerVariant = {
       hidden: { opacity: 0 },
       show: {
              opacity: 1,
              transition: {
                     staggerChildren: 0.12,
              },
       },
};

const cardVariant = {
       hidden: { opacity: 0, y: 20 },
       show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, ease: "easeOut" },
       },
};

const AdminDashBoardClient = ({
       totalRevenue,
       todayRevenue,
       last7DaysRevenue,
       totalOrder,
       pendingDelivery,
       totalCustomer,
       totalGrocery,
}) => {
       const [filterValue, setFilterValue] = useState("today");

       const getValue = () => {
              if (filterValue === "today") return todayRevenue;
              if (filterValue === "last7") return last7DaysRevenue;
              if (filterValue === "total") return totalRevenue;
              return 0;
       };

       return (
              <motion.div
                     variants={containerVariant}
                     initial="hidden"
                     animate="show"
                     className="min-h-screen w-full bg-linear-to-r from-green-100 via-green-100 to-orange-100 text-gray-700 p-4"
              >
                     {/* TOP BAR */}
                     <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="flex md:flex-row flex-col items-center justify-between bg-white p-4 rounded shadow gap-2"
                     >
                            <h1 className="text-xl font-bold text-orange-500">
                                   Admin Dashboard
                            </h1>

                            <select
                                   className="border rounded px-3 py-1 text-sm font-semibold outline-none cursor-pointer"
                                   value={filterValue}
                                   onChange={(e) => setFilterValue(e.target.value)}
                            >
                                   <option value="today">Today</option>
                                   <option value="last7">Last 7 Days</option>
                                   <option value="total">Total</option>
                            </select>
                     </motion.div>

                     {/* REVENUE CARD */}
                     <motion.div
                            variants={cardVariant}
                            whileHover={{ scale: 1.03 }}
                            className="mt-4 bg-white p-4 rounded shadow"
                     >
                            <p className="text-sm font-semibold">Revenue</p>
                            <p className="text-2xl font-bold text-green-600">
                                   ₹ {getValue()}
                            </p>
                     </motion.div>

                     {/* DASHBOARD CARDS */}
                     <motion.div
                            variants={containerVariant}
                            className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                     >
                            {[
                                   { label: "Total Orders", value: totalOrder, color: "text-green-600" },
                                   { label: "Pending Orders", value: pendingDelivery, color: "text-orange-600" },
                                   { label: "Total Customers", value: totalCustomer, color: "text-blue-600" },
                                   { label: "Total Grocery", value: totalGrocery, color: "text-purple-600" },
                            ].map((item, index) => (
                                   <motion.div
                                          key={index}
                                          variants={cardVariant}
                                          whileHover={{ y: -5, scale: 1.03 }}
                                          className="bg-white p-4 rounded shadow cursor-pointer"
                                   >
                                          <p className="text-sm font-semibold">{item.label}</p>
                                          <p className={`text-2xl font-bold ${item.color}`}>
                                                 {item.value}
                                          </p>
                                   </motion.div>
                            ))}
                     </motion.div>
              </motion.div>
       );
};

export default AdminDashBoardClient;



// "use client";
// import React, { useState } from "react";
// import { motion } from "framer-motion";


// const AdminDashBoardClient = ({
//        totalRevenue,
//        todayRevenue,
//        last7DaysRevenue,
//        totalOrder,
//        pendingDelivery,
//        totalCustomer,
//        totalGrocery
// }) => {

//        const [filterValue, setFilterValue] = useState("today");

//        const getValue = () => {
//               if (filterValue === "today") return todayRevenue;
//               if (filterValue === "last7") return last7DaysRevenue;
//               if (filterValue === "total") return totalRevenue;
//               return 0;
//        };

//        return (
//               <div className="min-h-screen w-full bg-linear-to-r from-green-100 via-green-100 to-orange-100 text-gray-700 p-4">

//                      {/* TOP BAR */}
//                      <motion.div
//                             initial={{ x: 40, opacity: 0 }}
//                             animate={{ x: 0, opacity: 1 }}
//                             transition={{ duration: 1.2, ease: "easeOut" }}


//                             className="flex md:flex-row flex-col  items-center justify-between bg-white p-4 rounded shadow">
//                             <h1 className="text-xl font-bold text-orange-500 capitalize line-clamp-1">
//                                    Admin Dashboard
//                             </h1>

//                             <select
//                                    className="border rounded px-3 py-1 text-sm font-semibold outline-none cursor-pointer"
//                                    value={filterValue}
//                                    onChange={(e) => setFilterValue(e.target.value)}
//                             >
//                                    <option value="today">Today</option>
//                                    <option value="last7">Last 7 Days</option>
//                                    <option value="total">Total</option>
//                             </select>
//                      </motion.div>

//                      {/* REVENUE CARD */}
//                      <motion.div
//                             initial={{ x: -40, opacity: 0 }}
//                             animate={{ x: 0, opacity: 1 }}
//                             transition={{ duration: 1.2, ease: "easeOut" }}

//                             className="mt-4 bg-white p-4 rounded shadow">
//                             <p className="text-sm font-semibold">Revenue</p>
//                             <p className="text-2xl font-bold text-green-600">
//                                    ₹ {getValue()}
//                             </p>
//                      </motion.div>

//                      {/* DASHBOARD CONTENT */}
//                      <div
//                             initial={{y: -40, opacity: 0 }}
//                             animate={{y : 0, opacity: 1 }}
//                             transition={{ duration: 1.2, ease: "easeOut" }}
//                             className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//                             <div className="bg-white p-4 rounded shadow">
//                                    <p className="text-sm font-semibold">Total Orders</p>
//                                    <p className="text-2xl font-bold text-green-600">{totalOrder}</p>
//                             </div>



//                             <div className="bg-white p-4 rounded shadow">
//                                    <p className="text-sm font-semibold">Pending Orders</p>
//                                    <p className="text-2xl font-bold text-orange-600">{pendingDelivery}</p>
//                             </div>

//                             <div className="bg-white p-4 rounded shadow">
//                                    <p className="text-sm font-semibold">Total Customer</p>
//                                    <p className="text-2xl font-bold text-orange-600">{totalCustomer}</p>
//                             </div>

//                             <div className="bg-white p-4 rounded shadow">
//                                    <p className="text-sm font-semibold">Total Grocery</p>
//                                    <p className="text-2xl font-bold text-orange-600">{totalGrocery}</p>
//                             </div>

//                      </div>

//               </div>
//        );
// };

// export default AdminDashBoardClient;



