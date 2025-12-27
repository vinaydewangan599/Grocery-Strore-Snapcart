import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DeliveryAssignment from "@/models/DeliveryAssignment";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const deliveryBoyId = new mongoose.Types.ObjectId(session.user.id);

    const assignments = await DeliveryAssignment.find({
      broadcastedTo: deliveryBoyId,
      status: "broadCasted",
    }).populate("orderId");

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error("get assignments error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
