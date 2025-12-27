// // ✅ CORRECTED API Route
// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/db";
// import Order from "@/models/Order";
// import User from "@/models/User";
// import DeliveryAssignment from "@/models/DeliveryAssignment";

// export async function POST(
//   req: NextRequest,
//   context: { params: Promise<{ orderId: string }> }
// ) {
//   try {
//     await dbConnect();

//     const { orderId } = await context.params;
//     const { status } = await req.json();

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return NextResponse.json(
//         { message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     order.orderStatus = status;

//     let deliveryBoysPayload: any[] = [];

//     if (
//       status === "Out of Delivery" &&
//       !order.assignment &&
//       order.deliveryAddress?.latitude != null &&
//       order.deliveryAddress?.longitude != null
//     ) {
//       const { latitude, longitude } = order.deliveryAddress;

//       const nearByDeliveryBoy = await User.find({
//         role: "DELIVERY_BOY",
//         isOnline: true,
//         "location.coordinates.0": { $ne: 0 },
//         "location.coordinates.1": { $ne: 0 },
//         location: {
//           $near: {
//             $geometry: {
//               type: "Point",
//               coordinates: [longitude, latitude],
//             },
//             $maxDistance: 100000,
//           },
//         },
//       });

//       if (nearByDeliveryBoy.length === 0) {
//         await order.save();
//         return NextResponse.json(
//           { message: "No delivery boy available", order },
//           { status: 200 }
//         );
//       }

//       const nearByIds = nearByDeliveryBoy.map((boy) => boy._id);

//       const busyIds = await DeliveryAssignment.find({
//         assignedTo: { $in: nearByIds },
//         status: { $nin: ["broadcasted", "completed"] },
//       }).distinct("assignedTo");

//       const busySet = new Set(busyIds.map((id) => id.toString()));

//       const availableDeliveryBoy = nearByDeliveryBoy.filter(
//         (boy) => !busySet.has(boy._id.toString())
//       );

//       if (availableDeliveryBoy.length === 0) {
//         await order.save();
//         return NextResponse.json(
//           { message: "All delivery boys are busy", order },
//           { status: 200 }
//         );
//       }

//       const candidateIds = availableDeliveryBoy.map((boy) =>
//         boy._id.toString()
//       );

//       const deliveryAssignment = await DeliveryAssignment.create({
//         orderId: order._id,
//         broadcastedTo: candidateIds,
//         status: "broadcasted"
// ,
//       });

//       order.assignment = deliveryAssignment._id;

//       // ✅ FIX: Proper type checking and coordinate access
//       deliveryBoysPayload = availableDeliveryBoy.map((boy) => {
//         const coords = boy.location?.coordinates ?? [0, 0];

//         return {
//           _id: boy._id.toString(),
//           name: boy.name,
//           mobile: boy.mobile,
//           latitude: coords[1],  // latitude is second element
//           longitude: coords[0], // longitude is first element
//         };
//       });
//     }

//     await order.save();

//     return NextResponse.json(
//       {
//         success: true,
//         orderStatus: order.orderStatus,
//         assignment: order.assignment,
//         availableBoys: deliveryBoysPayload,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Update order status error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Internal server error",
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import DeliveryAssignment from "@/models/DeliveryAssignment";
import mongoose from "mongoose";
import emitEventHandler from "@/lib/emitEventHandler";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> } // ✅ FIX: Promise wrapper
) {
  try {
    await dbConnect();

    // ✅ FIX: Await params
    const { orderId } = await context.params;
    const { status } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { message: "Invalid orderId" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // update order status
    order.orderStatus = status;

    let deliveryBoysPayload: any[] = [];

    // ✅ Delivery boy assignment logic
    if (
      status === "Out of Delivery" &&
      !order.assignment &&
      order.deliveryAddress?.latitude &&
      order.deliveryAddress?.longitude
    ) {
      const latitude = Number(order.deliveryAddress.latitude);
      const longitude = Number(order.deliveryAddress.longitude);

      // 🔍 find nearby delivery boys
      const nearByDeliveryBoy = await User.find({
        role: "DELIVERY_BOY",
        isOnline: true,
        "location.coordinates.0": { $ne: 0 }, // ✅ Exclude default [0,0]
        "location.coordinates.1": { $ne: 0 },
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 100000, // 100km
          },
        },
      });

      if (nearByDeliveryBoy.length === 0) {
        await order.save();
        return NextResponse.json(
          { success: true, message: "No delivery boy available", order },
          { status: 200 }
        );
      }

      const nearByIds = nearByDeliveryBoy.map((boy) => boy._id);

      // Find busy delivery boys (not completed)
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $ne: "completed" },
      }).distinct("assignedTo");

      const busySet = new Set(busyIds.map((id) => id.toString()));

      const availableDeliveryBoy = nearByDeliveryBoy.filter(
        (boy) => !busySet.has(boy._id.toString())
      );

      if (availableDeliveryBoy.length === 0) {
        await order.save();
        
       await emitEventHandler(
  'order-status-update',   // ✅ lowercase s
  {
    orderId: order._id,
    status: order.orderStatus,
  }
);



        return NextResponse.json(
          { success: true, message: "All delivery boys are busy", order },
          { status: 200 }
        );
      }

      const candidateIds = availableDeliveryBoy.map((boy) => boy._id);

      // Create delivery assignment
      const deliveryAssignment = await DeliveryAssignment.create({
        orderId: order._id,
        broadcastedTo: candidateIds,
        status: "broadCasted",
      }); 

      await deliveryAssignment.populate("orderId");

      //socket for delivery boy copying from youtube 
     for (const boy of availableDeliveryBoy) {
        if (!boy || !boy.socketId) continue;

        await emitEventHandler(
          "new-assignment",
         deliveryAssignment,
          boy.socketId
        );
      }


      

      order.assignment = deliveryAssignment._id;

      // Prepare payload for frontend/socket
      deliveryBoysPayload = availableDeliveryBoy.map((boy) => {
        const coords = boy.location?.coordinates ?? [0, 0];
        return {
          _id: boy._id.toString(),
          name: boy.name,
          mobile: boy.mobile,
          latitude: coords[1],
          longitude: coords[0],
        };
      });
    }

    await order.save();
    await order.populate("userId");
    await emitEventHandler(
  'order-status-update',   // ✅ lowercase s
  {
    orderId: order._id,
    status: order.orderStatus,
  }
);

  
    return NextResponse.json(
      {
        success: true,
        orderStatus: order.orderStatus,
        assignment: order.assignment,
        availableBoys: deliveryBoysPayload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}