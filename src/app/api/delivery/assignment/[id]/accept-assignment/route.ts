import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DeliveryAssignment from "@/models/DeliveryAssignment";
import Order from "@/models/Order";
import mongoose from "mongoose";
import { auth } from "@/auth";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params;

    // 🔹 LOG 1: API hit + assignment id
    console.log("ACCEPT API HIT → assignmentId:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid assignment id" },
        { status: 400 }
      );
    }

    const session = await auth();
    const deliveryBoyId = session?.user?.id;

    if (!deliveryBoyId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const assignment = await DeliveryAssignment.findById(id);

    // 🔹 LOG 2: assignment + orderId
    console.log(
      "Assignment found:",
      !!assignment,
      "orderId:",
      assignment?.orderId
    );

    if (!assignment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 400 }
      );
    }

    if (assignment.status !== "broadCasted") {
      return NextResponse.json(
        { message: "Assignment expired" },
        { status: 400 }
      );
    }

    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    // 🔹 LOG 3: before order update
    console.log("Updating order with orderId:", assignment.orderId);

    const order = await Order.findByIdAndUpdate(
      assignment.orderId,
      {
        $set: {
          assignDeliveryBoy: deliveryBoyId,
          assignment: assignment._id,
        },
      },
      { new: true }
    );

    // 🔹 LOG 4: after order update
    console.log(
      "Order updated:",
      !!order,
      "assignDeliveryBoy:",
      order?.assignDeliveryBoy
    );

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 400 }
      );
    }

    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assignment._id },
        broadcastedTo: deliveryBoyId,
        status: "broadCasted",
      },
      {
        $pull: { broadcastedTo: deliveryBoyId },
      }
    );

    return NextResponse.json(
      { success: true, message: "Assignment accepted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Accept assignment error:", error);
    return NextResponse.json(
      { message: "Accept assignment error" },
      { status: 500 }
    );
  }
}
