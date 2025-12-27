import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import DeliveryAssignment from "@/models/DeliveryAssignment";

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const { orderId, otp } = await req.json()
        if (!orderId || !otp) {
            return NextResponse.json(
                { message: "orderId or OTP not found" },
                { status: 400 }
            )
        }

        const order=await Order.findById(orderId)
        if(!order){
            return NextResponse.json(
                {message:"order not found"},
                {status:400}
            )
        }

        if(order.deliveryOtp !== otp){
            return NextResponse.json(
                {message:"Incorrect or expired Otp"},
                {status:400}
            )
        }
        order.orderStatus="delivered"
        order.deliveryOtpVerification=true
        order.deliveredAt=new Date()
        await order.save()

        await DeliveryAssignment.updateOne(
            {orderId:orderId},
            {$set:{assignedTo:null,status:"completed"}}
        )


        return NextResponse.json(
            {message:"Delivery successfully completed"},
            {status:200}
        )




    } catch (error) {
        return NextResponse.json(
            { message: `verify otp error ${error}` },
            { status: 500 }
        )
    }
}