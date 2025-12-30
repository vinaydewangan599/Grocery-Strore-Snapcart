"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PackageSearch } from "lucide-react";
import axios from "axios";

import { motion } from "motion/react";
import UserOrderCard from "@/components/UserOrderCard";
import mongoose from "mongoose";
import { IUser } from "@/models/User";
import { getSocket } from "@/lib/socket";

interface IOrder{
    _id?:mongoose.Types.ObjectId,
    userId:mongoose.Types.ObjectId,
    items:[
        {
            groceryId:mongoose.Types.ObjectId,
            name:string,
            quantity:number,
            price:number,
            unit:string,
            image:string 
        }
    ],
    totalAmount:number,  
    paymentMethod:"cod" | "online",
    orderStatus:"pending" | "Out of Delivery"  | "delivered" | "cancelled",
    isPaid:boolean,
    deliveryAddress:{
        name:string,
        mobile:string,
        city:string,
        state:string,
        pincode:string,
        address:string,
        latitude?: number;
        longitude?: number;

    },
    assignment?:mongoose.Types.ObjectId,
    assignDeliveryBoy?:IUser,
    createdAt?:Date,
    updatedAt?:Date  
}

const MyOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const result = await axios.get("/api/user/my-orders");
        setOrders(result.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getMyOrders();
  }, []);

  // Move this BEFORE the early return
  useEffect(() => {
    const socket = getSocket();
    socket.on("order-assigned", ({orderId, assignDeliveryBoy}) => {
      setOrders((prev) => prev?.map((o) => (
        o._id == orderId ? {...o, assignDeliveryBoy} : o
      )))
    })

    return () => {socket.off("order-assigned")}
  }, [])

  useEffect(() => {
    const socket = getSocket()
    socket.on("order-assigned", ({orderId, assignedDeliveryBoy}) => {
        setOrders((prev) => prev?.map((o) => (
            o._id == orderId ? {...o, assignedDeliveryBoy} : o
        )))
    })

    return () => {socket.off("order-assigned")}
}, [])

  // NOW the early return is fine
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-[50vh]
    text-gray-600"
      >
        Loading Your Orders...
      </div>
    );
  }

  return (
    <div className="bg-linear-to-b from-white to-gray-100 min-h-screen w-full">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative">
        <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50">
          <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
            <button
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition"
              onClick={() => router.back()}
            >
              <ArrowLeft size={24} className="text-green-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
          </div>
        </div>

        <div className="mt-20 space-y-4">
          {orders.length === 0 ? (
            <div className="pt-20 flex flex-col items-center text-center">
              <PackageSearch size={70} className="text-green-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">
                No Orders Found
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Start shopping to view your orders here.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-6">
              {orders?.map((order, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <UserOrderCard order={order} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;

