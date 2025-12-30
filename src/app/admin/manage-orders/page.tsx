"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { useRouter } from "next/navigation";
import { ArrowLeft } from 'lucide-react';
import AdminOrderCard from "@/components/AdminOrderCard";
import { getSocket } from "@/lib/socket";
import mongoose from "mongoose";
import type { IUser } from "@/models/User";



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

const ManageOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const router = useRouter();
  useEffect(() => {
    const getOrders = async () => {
      try {
        const result = await axios.get("/api/admin/get-orders");
        setOrders(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getOrders();
  }, []);

  useEffect(():any=>{
  const socket=getSocket()
  socket?.on("new-order",(newOrder)=>{
    setOrders((prev)=>[newOrder,...prev!])
  })
  socket.on("order-assigned", ({orderId, assignDeliveryBoy}) => {
    setOrders((prev) => prev?.map((o) => (
        o._id?.toString() === orderId?.toString() ? { ...o, assignDeliveryBoy } : o
    )))
})
  return ()=>{
    socket.off("order-assigned");
    socket.off("new-order")
  }
},[])




  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
          <button
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition"
            onClick={() => router.push("/")}
          >
            <ArrowLeft size={24} className="text-green-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Manage Orders</h1>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-8">
        {/* Order List Mapping */}
        <div className='space-y-6'>
            {orders?.map((order, index) => (
            <AdminOrderCard order={order} key={order._id?.toString()}
 />
            ))}
        </div>
      </div>
      
    </div>
  );
};

export default ManageOrders;
