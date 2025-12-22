import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/auth";

export async function GET() {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await Order.find({
      userId: session.user.id,
    }).populate("userId");

    return NextResponse.json(orders, {
      status: 200,
    });

  } catch (error: any) {
    return NextResponse.json(
      { message: `get all orders error: ${error.message}` },
      { status: 500 }
    );
  }
}
