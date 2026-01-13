import { auth } from "@/auth";
import Nav from "@/component/Nav";
import PhoneNumRole from "@/component/PhoneNumRole";
import PhoneNumVerify from "@/component/PhoneNumVerify";
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
  if (!user.mobileVerified) {
    return <PhoneNumVerify mobile={user.mobile} />;
  }

  // STEP 3 PE YE CHALEGA
  return (
    <Nav />
  );
};

export default Home;

