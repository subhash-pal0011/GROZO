import { auth } from "@/auth";
import AdminDashboard from "@/component/AdminDashboard";
import DeliveryBoyDashboard from "@/component/DeliveryBoyDashboard";
import Nav from "@/component/Nav";
import PhoneNumRole from "@/component/PhoneNumRole";
import PhoneNumVerify from "@/component/PhoneNumVerify";
import UpdateLocation from "@/component/UpdateLocation";
import UserDashboard from "@/component/UserDashboard";
import dbConnect from "@/connectDb/dbConnect";
import User from "@/models/user";
import { redirect } from "next/navigation";

const Home = async () => {
  await dbConnect();

  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await User.findOne({ email: session.user.email });
  if (!user) redirect("/register");

  // STEP 1 PE YE CHALEGA
  if (!user.mobile || !user.role) {
    return <PhoneNumRole />;
  }

  //// STEP 2 PE YE CHALEGA
  // if (!user.mobileVerified) {
  //   return <PhoneNumVerify mobile={user.mobile} />;
  // }

  // isko is error se bachne ke liye bana pada<... user={{$__: ..., $isNew: false, _doc: ...}}>
  const plainUser = JSON.parse(JSON.stringify(user))

  // STEP 3 PE YE CHALEGA
  return (
    <>
      <Nav user={plainUser}/>
      <UpdateLocation userId={plainUser._id}/>
      {user?.role === "user" ? (
        <UserDashboard />
      ) : user?.role === "admin" ? (
        <AdminDashboard />
      ) : <DeliveryBoyDashboard />}
    </>
  );
};

export default Home;

