"use client";
import React, { useEffect, useState } from "react";

import { motion } from "motion/react";
import { Package, MapPin, ChevronUp, ChevronDown, Truck,User,Phone, CreditCard } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { error } from "console";
import { set } from "mongoose";
import mongoose from "mongoose";
import type { IUser } from "@/models/User";
import { UserCheck } from "lucide-react";
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

const AdminOrderCard = ({ order }: { order: IOrder }) => {
  

  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<string>("pending");

  useEffect(() => {
    setStatus(order.orderStatus);
  }, [order.orderStatus]);

  const statusOptions = [
    "pending",
    "Out of Delivery"
  ];


const updateStatus = async (orderId: string, status: string) => {
  try {
    const result = await axios.post(
      `/api/admin/update-order-status/${orderId}`,
      { status }
    );

    console.log(result.data);
    setStatus(status);
  } catch (error) {
    console.error(error);
  }
};
  useEffect((): any => {
  const socket = getSocket()
  socket.on("order-status-update", (data) => {
    if (data.orderId.toString() == order?._id!.toString()) {
      setStatus(data.status)
    } 
  })

  return () => socket.off("order-status-update")
}, [])




  return (
    <motion.div
      key={order._id?.toString()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-lg font-bold flex items-center gap-2 text-green-700">
            <Package size={20} />
            Order #{order._id?.toString().slice(-6)}
          </p>
          {status !== "delivered" && <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
              order.isPaid
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span> }
          
          <p className="text-gray-500 text-sm">
            {new Date(order.createdAt!).toDateString()}
          </p>
          <div className="mt-3 space-y-1 text-gray-700 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <User size={16} className="text-green-600" />
              <span>{order?.deliveryAddress.name}</span>
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <Phone size={16} className="text-green-600" />
              <span>{order?.deliveryAddress.mobile}</span>
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <MapPin size={16} className="text-green-600" />
              <span>{order?.deliveryAddress.address}</span>
            </p>
           
          </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
              <CreditCard size={16} className="text-green-600" />
              <span>{order.paymentMethod=="cod"?"cash on Delivery":"online payment"}</span>
            </p>

            {order.assignDeliveryBoy && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <UserCheck className="text-blue-600" size={18} />

                  <div className="font-semibold text-gray-800">
                    <p>
                      Assigned to :{" "}
                      <span className="font-bold">
                        {order.assignDeliveryBoy.name}
                      </span>
                    </p>

                    {order.assignDeliveryBoy.mobile && (
                      <p className="text-xs text-gray-600">
                        📞 +91 {order.assignDeliveryBoy.mobile}
                      </p>
                    )}
                  </div>
                </div>

                {order.assignDeliveryBoy.mobile && (
                  <a
                    href={`tel:+91${order.assignDeliveryBoy.mobile}`}
                    className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                  >
                    Call
                  </a>
                )}
              </div>
            )}


        </div>

        <div className='flex flex-col items-start md:items-end gap-2'>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                status === "delivered"
                ? "bg-green-100 text-green-700"
                : status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}>
                {status}
            </span>
            {status !== "delivered" && (
               <select className='border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none'
            onChange={(e)=>updateStatus(order._id?.toString()!,e.target.value)} value={status}>
                {statusOptions.map(st => (
                <option key={st} value={st}>{st.toUpperCase()}</option>
                ))}
            </select>
            )}
           
        </div>

      </div> 

         <div className="border-t border-gray-200 mt-3 pt-3">
                  <button
                    onClick={() => setExpanded((prev) => !prev)}
                    className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition"
                  >
                    <span className="flex items-center gap-2">
                      <Package size={16} className="text-green-600" />
                      {expanded
                        ? "Hide Order Items"
                        : `view ${order.items.length} Items`}
                    </span>
        
                    {expanded ? (
                      <ChevronUp size={16} className="text-green-600" />
                    ) : (
                      <ChevronDown size={16} className="text-green-600" />
                    )}
                  </button>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: expanded ? "auto" : 0,
                      opacity: expanded ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-3">
                      {/* Item content goes here */}
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="rounded-lg object-cover border border-gray-200"
                            />
                            <div>
                                <p className='text-sm font-medium text-gray-800'>{item.name}</p>
                                <p className='text-xs text-gray-500'>{item.quantity} x {item.unit}</p>
                            </div>
                          </div>
                          <p className='text-sm font-semibold text-gray-800'>₹{Number(item.price) * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
        </div>

        <div className='border-t mt-3 pt-3 flex justify-between items-center text-sm font-semibold text-gray-800'>
                <div className='flex items-center gap-2 text-gray-700 text-sm'>
                    <Truck size={16} className="text-green-600"/>
                    <span>Delivery: <span className='text-green-700 font-semibold'>{status}</span></span>
                </div>
                <div>
                    Total: <span className='text-green-700 font-bold'>₹{order.totalAmount}</span>
                </div>
        </div>
      
    </motion.div>
  );
};

export default AdminOrderCard;
