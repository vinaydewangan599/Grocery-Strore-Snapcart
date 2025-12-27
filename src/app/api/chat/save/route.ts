
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { senderId, text, roomId, time } = await req.json();
    const room = await Order.findById(roomId);
    if (!room) {
      return NextResponse.json({ message: `room not found` }, { status: 400 });
    }

    const message = await Message.create({
      senderId,
      text,
      roomId,
      time,
    });
    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.error("message error:", error);
    return NextResponse.json(
      { message: `save message error ${error}` },
      { status: 500 }
    );
  }
}
