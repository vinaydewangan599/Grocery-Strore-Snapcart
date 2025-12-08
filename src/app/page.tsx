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

const Home = async () => {
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

  return (
    <>
      <Navbar user={planUser} />
      {user.role == "USER" ? (
        <UserDashboard />
      ) : user.role == "ADMIN" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoy />
      )}
    </>
  );
};

export default Home;
