import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";


export async function POST(req:NextRequest ,{params}:{params:{orderId:string}}){
    try {
        await dbConnect();
        const { orderId } = params;
        const { status } = await req.json();
        const order = await Order.findById(orderId).populate('userId');
        if (!order) {
            return NextResponse.json({ status: 400, message: "Order not found" });
        }
        order.orderStatus = status;
        let availableDeliveryBoy:any = [];
        if(status==="Out of Delivery" && !order.assignment){
            
        }

        return NextResponse.json({ status: true, order });
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json({ status: false, error });
    }

}
