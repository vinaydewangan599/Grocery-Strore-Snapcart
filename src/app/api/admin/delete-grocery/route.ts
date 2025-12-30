
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Grocery from "@/models/Grocery";
import { auth } from "@/auth";


export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();

    // Role check fix: ADMIN instead of admin
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "You are not admin" }, { status: 400 });
    }

    const {groceryId} =await req.json();

    
    const grocery = await Grocery.findByIdAndDelete(groceryId);

    return NextResponse.json({ grocery }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Delete grocery error: ${error}` },
      { status: 500 }
    );
  }
}
