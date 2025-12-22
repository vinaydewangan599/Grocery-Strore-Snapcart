// import { auth } from "@/auth";
// import User from "@/models/User";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req:NextRequest) {
//     try {
//         const session=await auth();
//         if(!session || !session.user){
//             return NextResponse.json(
//             {message:"user is not authenticated"},
//             {status:400}
//             )
//         }
//         const user=await User.findOne({email:session.user.email}).select("-password");
//         if(!user){
//             return NextResponse.json(
//                 {message:"user not found"},
//                 {status:404}
//             )
//         }
//         return NextResponse.json(user, {status:200});
//     } catch (error) {
//         console.error("Error fetching user data:", error);
//         return NextResponse.json(
//             {message:"Internal Server Error"},
//             {status:500}
//         )
//     }
// }

import { auth } from "@/auth";
import User from "@/models/User";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1️⃣ Ensure DB connection (prevents idle crash)
    await connectDB();

    // 2️⃣ Get session safely
    const session = await auth();

    // 3️⃣ Handle unauthenticated user (NORMAL case)
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 4️⃣ Fetch user safely
    const user = await User.findOne({
      email: session.user.email,
    }).select("-password");

    // 5️⃣ Handle user not found
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 6️⃣ Success
    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error("GET /api/me error:", error);

    // 7️⃣ Catch-all (should be rare now)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
