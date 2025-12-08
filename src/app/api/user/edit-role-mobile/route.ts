import { NextResponse, NextRequest } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { role, mobile } = await req.json();
    const session = await auth();
    const user = await User.findOneAndUpdate(
      { email: session?.user?.email },
      {
        role,
        mobile,
      },{
        new: true
        }
    );
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "user updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 }
    );
  }
}
