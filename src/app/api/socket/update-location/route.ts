import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { userId, location } = await req.json();

    if (!userId || !location) {
      return NextResponse.json(
        { message: "Missing userId or location" },
        { status: 400 }
      );
    }
    console.log("🔥 UPDATE LOCATION API CALLED");

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { location },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Location updated successfully", updatedUser },
      { status: 200 }
    );

  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
