import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import {sendMail} from "@/lib/mailer";

export async function POST(req:NextRequest) {
    try {
        await dbConnect();
        const {orderId}=await req.json();
        const order=await Order.findById(orderId).populate("userId");
        
        if(!order){
            return NextResponse.json(
                {message:"order not found"},
                {status:400}
            )
        }

        const otp=Math.floor(1000+Math.random()*9000).toString()
        order.deliveryOtp=otp
        await order.save()

        await sendMail(
            order.userId.email,  // Fixed: use userId instead of user
            "Your Delivery OTP",
            `<h2>Your Delivery OTP is <strong>${otp}</strong></h2>`
        )
        
        return NextResponse.json(
            {message:"otp sent successfully"},
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {message:`send otp error ${error}`},
            {status:500}  // Also changed to 500 for server errors
        )
    }
}