import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import emitEventHandler from "@/lib/emitEventHandler";

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

    await emitEventHandler("new-order", newOrder);


    return NextResponse.json(
      { message: "Order placed successfully", order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
