import { auth } from "@/auth";
import EditRoleMobile from "@/components/EditRoleMobile";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { a } from "motion/react-client";
import { redirect } from "next/navigation";
import React from "react";
import Navbar from "@/components/Navbar";
import UserDashboard from "@/components/UserDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import GeoUpdater from "@/components/GeoUpdater";
import Grocery from "@/models/Grocery";
import type { IGrocery } from "@/models/Grocery";
import Footer from "@/components/Footer";

const Home = async (props:{searchParams:Promise<{q:string}>}) => {

  const searchParams = await props.searchParams;
  await dbConnect();
  const session = await auth();
  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/auth/login");
  }
  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role == "USER");

  if (inComplete) {
    return <EditRoleMobile />;
  }
  const planUser = JSON.parse(JSON.stringify(user));

  let groceryList: IGrocery[] = []

if (user.role === "USER") {
    if (searchParams.q) {
        groceryList = await Grocery.find({
            $or: [
                { name: { $regex: searchParams?.q || "", $options: "i" } },
                { category: { $regex: searchParams?.q || "", $options: "i" } },
            ]
        })
    } else{
      groceryList = await Grocery.find({}).lean();
    }
}

  return (
    <>
      <Navbar user={planUser} />
      <GeoUpdater userId={planUser._id} />
      {user.role == "USER" ? (
        <UserDashboard groceryList={groceryList} />
      ) : user.role == "ADMIN" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoy />
      )}
      <Footer/>
    </>
  );
};

export default Home;
