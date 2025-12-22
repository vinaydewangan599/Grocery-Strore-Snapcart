
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order"; 
import Stripe from "stripe";

const stripe= new Stripe(process.env.STRIPE_SECRET_KEY!)


export async function POST(req: NextRequest) {

     try {
    await dbConnect();

    const {
      userId,
      items,
      paymentMethod,
      totalAmount,
      deliveryAddress,
    } = await req.json();

    if (!userId || !items || !paymentMethod || !totalAmount || !deliveryAddress) {
      return NextResponse.json(
        { message: "Please send all required fields" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const newOrder = await Order.create({
      userId: user._id, // ✅ FIXED
      items,
      paymentMethod,
      totalAmount,
      deliveryAddress,
    });

    const session=await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        mode:"payment",
        success_url:`${process.env.NEXT_BASE_URL}/user/order-success`,
        cancel_url:`${process.env.NEXT_BASE_URL}/user/order-cancel`,
        line_items: [
            {
            price_data: {
                currency: 'inr',
                product_data: {
                name: 'SnapCart Order Payment',
                },
                unit_amount: totalAmount * 100,
            },
            quantity: 1,
            },
        ],
        metadata:{
            orderId:newOrder._id.toString()
        }
    })

    return NextResponse.json(
        { paymentUrl:session.url },
        
        { status: 200 }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { message: `order payment error ${error}` },
      { status: 500 }
    );
  }
}