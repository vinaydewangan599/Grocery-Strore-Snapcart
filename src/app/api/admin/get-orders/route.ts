
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import {NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const orders = await Order.find({}).populate("userId");
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: `Failed to fetch orders: ${error}` },
      { status: 500 }
    );
  }
}
