
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Grocery from "@/models/Grocery";
import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();

    // Role check fix: ADMIN instead of admin
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "You are not admin" }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const groceryId = formData.get("groceryId") as string;
    const category = formData.get("category") as string;
    const unit = formData.get("unit") as string;
    const price = formData.get("price") as string;
    const file = formData.get("image") as Blob | null;

    let imageUrl;
    if (file) {
      imageUrl = await uploadOnCloudinary(file);
    }

    const grocery = await Grocery.findByIdAndUpdate(groceryId, {
      name,
      price,
      category,
      unit,
      image: imageUrl,
    });

    return NextResponse.json({ grocery }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Edit grocery error: ${error}` },
      { status: 500 }
    );
  }
}
