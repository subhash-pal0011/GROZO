import React from "react";
import AdminDashBoardClient from "./AdminDashBoardClient";
import dbConnect from "@/connectDb/dbConnect";
import Order from "@/models/orderModel";
import User from "@/models/user";
import Grozo from "@/models/grozoModels";

async function AdminDashboard() {
  await dbConnect();

  const orders = await Order.find({});
  const users = await User.find({ role: "user" });
  const groceries = await Grozo.find({});

  const totalOrder = orders.length;
  const totalCustomer = users.length;
  const totalGrocery = groceries.length;


  //Abhi tak deliver nahi hue orders (sirf placed status wale)
  const pendingDelivery = orders.filter((order) => order.orderStatus === "placed").length;



  // 🧠 totalRevenue MTLB jitna paisa tumne orders se kamaya hai total (successfully delivered orders se) ISME refunds / cancelled count nahi hote.
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.orderStatus === "delivered") {
      return sum + (order?.priceDetails?.totalAmount || 0);
    }
    return sum;
  }, 0);


  // 🧠 TODAY LOGIC
  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  // TODAY KA ORDER PAHLE FIND KR RLO
  const todayOrders = orders.filter((order) => new Date(order.createdAt) >= startOfToday);


  const todayRevenue = todayOrders.reduce((sum, order) => {
    if (order.orderStatus === "delivered") {
      return sum + (order?.priceDetails?.totalAmount || 0);
    }
    return sum;
  }, 0);



  // 🧠 LAST 7 DAYS LOGIC
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // 🧠LAST SAVEN DAY KA PAHLE ORDER NILKALNA PADEGA
  const last7DaysOrders = orders.filter((order) => new Date(order.createdAt) >= sevenDaysAgo);


  const last7DaysRevenue = last7DaysOrders.reduce((sum, order) => {
    if (order.orderStatus === "delivered") {
      return sum + (order?.priceDetails?.totalAmount || 0); // || 0 mtlb value hii to thik verna 0 rkho
    }
    return sum;
  }, 0); //🧠 0 initial value hii o dena padta hii.


  // 🧠 DATA PASS TO CLIENT COMPONENT
  return (
    <AdminDashBoardClient
      totalOrder={totalOrder}//.
      totalCustomer={totalCustomer}//.
      totalGrocery={totalGrocery}
      pendingDelivery={pendingDelivery}//.
      totalRevenue={totalRevenue}//.
      todayRevenue={todayRevenue}//.
      last7DaysRevenue={last7DaysRevenue}//.
    />
  );
}


export default AdminDashboard;
