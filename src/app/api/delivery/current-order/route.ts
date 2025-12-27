import dbConnect from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import DeliveryAssignment from "@/models/DeliveryAssignment";
import mongoose from "mongoose";
import Order from "@/models/Order";

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

    const deliveryBoyId = new mongoose.Types.ObjectId(session.user.id);

    const activeAssignment = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: "assigned",
    })
      .populate({
        path: "orderId",
        model: Order  // Add the model reference
      })
      .lean();

    if (!activeAssignment) {
      return NextResponse.json({ active: false }, { status: 200 });
    }

    return NextResponse.json(
      { active: true, assignment: activeAssignment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Active assignment error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}