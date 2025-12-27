
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { roomId } = await req.json();
    const room = await Order.findById(roomId);
    if (!room) {
      return NextResponse.json({ message: `room not found` }, { status: 400 });
    }

    const messages = await Message.find({ roomId: room._id });
    return NextResponse.json(messages, { status: 200 });


  } catch (error) {
    console.error("message error:", error);
    return NextResponse.json(
      { message: `get messages error ${error}` },
      { status: 500 }
    );
  }
}
