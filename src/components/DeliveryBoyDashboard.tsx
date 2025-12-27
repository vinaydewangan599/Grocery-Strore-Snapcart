// "use client"; // Add this at the top

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import dynamic from "next/dynamic";
// import DeliveryChat from "./DeliveryChat";
// import { getSocket } from "@/lib/socket";
// import { set } from "mongoose";
// import { send } from "process";
// import { Loader } from "lucide-react";

// // Dynamically import LiveMap with no SSR
// const LiveMap = dynamic(() => import("./LiveMap"), { ssr: false });

// interface Ilocation {
//   latitude: number;
//   longitude: number;
// }

// const DeliveryBoyDashboard = () => {
//   const [assignments, setAssignments] = useState<any[]>([]);
//   const { userData } = useSelector((state: RootState) => state.user);
//   const [activeOrder, setActiveOrder] = useState<any>(null);
//   const [otpError, setOtpError] = useState("")
//   const [sendOtpLoading, setSendOtpLoading] = useState(false)
//   const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)
//   const [userLocation, setUserLocation] = useState<Ilocation>({
//     latitude: 0,
//     longitude: 0,
//   });
//   const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<Ilocation>({
//     latitude: 0,
//     longitude: 0,
//   });
//   const [isMounted, setIsMounted] = useState(false);
//   const [showOtpBox, setShowOtpBox] = useState(false);
//   const [otp, setOtp] = useState("");
//   // Ensure component is mounted before using browser APIs
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const fetchAssignments = async () => {
//     try {
//       const result = await axios.get("/api/delivery/get-assignments");
//       setAssignments(result.data);
//       console.log("result of these is ", result);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect((): any => {
//     if (!isMounted || !userData?._id) return;
//     if (typeof window === "undefined") return;
    
//     // Dynamically import socket only on client side
//     const initSocket = async () => {
//       const { getSocket } = await import("@/lib/socket");
//       const socket = getSocket();

//       if (!navigator.geolocation) return;

//       const watcher = navigator.geolocation.watchPosition(
//         (pos) => {
//           const lat = pos.coords.latitude;
//           const lon = pos.coords.longitude;

//           setDeliveryBoyLocation({
//             latitude: lat,
//             longitude: lon,
//           });

//           socket.emit("update-location", {
//             userId: userData?._id,
//             latitude: lat,
//             longitude: lon,
//           });
//         },
//         (err) => console.log(err),
//         { enableHighAccuracy: true }
//       );

//       return () => navigator.geolocation.clearWatch(watcher);
//     };

//     initSocket();
//   }, [userData?._id, isMounted]);

//   useEffect((): any => {
//     if (!isMounted) return;
//     if (typeof window === "undefined") return;

//     const initSocket = async () => {
//       const { getSocket } = await import("@/lib/socket");
//       const socket = getSocket();

//       socket.on("new-assignment", (deliveryAssignment) => {
//         setAssignments((prev) => [...prev, deliveryAssignment]);
//       });

//       return () => socket.off("new-assignment");
//     };

//     initSocket();
//   }, [isMounted]);

//   const handleAccept = async (assignmentId: string) => {
//     try {
//       const result = await axios.post(
//         `/api/delivery/assignment/${assignmentId}/accept-assignment`
//       );
//       console.log("result is: ", result);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchCurrentOrder = async () => {
//     try {
//       const result = await axios.get("/api/delivery/current-order");
//       if (result.data.active) {
//         setActiveOrder(result.data.assignment);
//         setUserLocation({
//           latitude: result.data.assignment.orderId.deliveryAddress.latitude,
//           longitude: result.data.assignment.orderId.deliveryAddress.longitude,
//         });
//       }
//       console.log(result);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(():any => {
//     const socket = getSocket()
//     socket.on("update-deliveryBoy-location", ({userId, location}) => {
//         setDeliveryBoyLocation({
//             latitude: location.coordinates[1],
//             longitude: location.coordinates[0]
//         })
//     })

//     return () => socket.off("update-deliveryBoy-location")
// }, [])

//   useEffect(() => {
//     if (isMounted) {
//       fetchCurrentOrder();
//       fetchAssignments();
//     }
//   }, [userData, isMounted]);

// const sendOtp=async ()=>{
//     setSendOtpLoading(true)
//     try {
//         const result=await axios.post("/api/delivery/otp/send",{orderId:activeOrder.orderId._id})
//         console.log(result.data)
//         setShowOtpBox(true)
//         setSendOtpLoading(false)
//     } catch (error) {
//         console.log(error)
//         setSendOtpLoading(false)
//     }
// }
// const verifyOtp=async ()=>{
//     setVerifyOtpLoading(true);
//     try {
//         const result=await axios.post("/api/delivery/otp/verify",{orderId:activeOrder.orderId._id,otp})
//         console.log(result.data)
//         setActiveOrder(null)
//         setVerifyOtpLoading(false)
//         await fetchCurrentOrder()

//     } catch (error) {
//         setOtpError("Otp Verification Error")
//         console.log(error)
//         setVerifyOtpLoading(false)
//     }
// }

//   // Don't render until mounted
//   if (!isMounted) {
//     return (
//       <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }
//   console.log("active order is ", activeOrder);
//   if (activeOrder && userLocation) {
//     return (
//       <div className="p-4 pt-[120px] min-h-screen bg-gray-50">
//         <div className="max-w-3xl mx-auto">
//           <h1 className="text-2xl font-bold text-green-700 mb-2">
//             Active Delivery
//           </h1>
//           <p className="text-gray-600 text-sm mb-4">
//             order#{activeOrder.orderId._id.slice(-6)}
//           </p>

//           <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
//             <LiveMap
//               userLocation={userLocation}
//               deliveryBoyLocation={deliveryBoyLocation}
//             />
//           </div>

//           <DeliveryChat orderId={activeOrder.orderId._id} deliveryBoyId={userData?._id!}/>
//           <div className='mt-6 bg-white rounded-xl border shadow p-6'>
//               {!activeOrder.orderId.deliveryOtpVerification && !showOtpBox && (
//                   <button onClick={sendOtp} className='w-full py-4 bg-green-600 text-center text-white rounded-lg'>{sendOtpLoading ? <Loader size={16} className="animate-spin text-white"/>: "Mark as Delivered"}</button>
//               )}
//               {showOtpBox && (
//                   <div className='mt-4'>
//                       <input type="text" className='w-full py-3 border rounded-lg text-center' placeholder='Enter Otp' maxLength={4}
//                       value={otp} onChange={(e)=>setOtp(e.target.value)}/>
//                       <button className='w-full mt-4 bg-blue-600 text-center text-white py-3 rounded-lg' onClick={verifyOtp}>{verifyOtpLoading ? <Loader size={16} className="animate-spin text-white"/>: "Verify Otp"}</button>
//                       {otpError && <div className='text-red-600 mt-2'>{otpError}</div>}
//                   </div>
//               )}
//               {activeOrder.orderId.deliveryOtpVerification && <div className='text-green-700 text-center font-bold'>Delivery completed!</div>}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-screen bg-gray-50 p-4">
//       <div className="max-w-3xl mx-auto">
//         <h2 className="text-2xl font-bold mt-[120px] mb-[30px]">
//           Delivery Assignments
//         </h2>

//         {assignments.map((a) => {
//           const order = a.orderId;

//           return (
//             <div
//               key={a._id}
//               className="p-5 bg-white rounded-xl shadow mb-4 border"
//             >
//               <p>
//                 <b>Order Id </b> #{order._id.slice(-6)}
//               </p>

//               <p className="text-gray-600">
//                 {order.deliveryAddress.address}, {order.deliveryAddress.city},{" "}
//                 {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
//               </p>

//               <p className="mt-2 text-sm text-gray-700">
//                 <b>Total:</b> ₹{order.totalAmount} | <b>Payment:</b>{" "}
//                 {order.paymentMethod}
//               </p>

//               <div className="flex gap-3 mt-4">
//                 <button
//                   className="flex-1 bg-green-600 text-white py-2 rounded-lg"
//                   onClick={() => handleAccept(a._id)}
//                 >
//                   Accept
//                 </button>
//                 <button className="flex-1 bg-red-500 text-white py-2 rounded-lg">
//                   Reject
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default DeliveryBoyDashboard;

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import DeliveryChat from "./DeliveryChat";
import { Loader } from "lucide-react";

// Dynamically import LiveMap with no SSR
const LiveMap = dynamic(() => import("./LiveMap"), { ssr: false });

interface Ilocation {
  latitude: number;
  longitude: number;
}

const DeliveryBoyDashboard = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [otpError, setOtpError] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null); // ✅ NEW: Track accepting assignment
  const [userLocation, setUserLocation] = useState<Ilocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<Ilocation>({
    latitude: 0,
    longitude: 0,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");

  // Ensure component is mounted before using browser APIs
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments");
      setAssignments(result.data);
      console.log("result of these is ", result);
    } catch (error) {
      console.log(error);
    }
  };

  // Track delivery boy's location
  useEffect((): any => {
    if (!isMounted || !userData?._id) return;
    if (typeof window === "undefined") return;

    const initSocket = async () => {
      const { getSocket } = await import("@/lib/socket");
      const socket = getSocket();

      if (!navigator.geolocation) return;

      const watcher = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          setDeliveryBoyLocation({
            latitude: lat,
            longitude: lon,
          });

          socket.emit("update-location", {
            userId: userData?._id,
            latitude: lat,
            longitude: lon,
          });
        },
        (err) => console.log(err),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    };

    initSocket();
  }, [userData?._id, isMounted]);

  // Listen for new assignments
  useEffect((): any => {
    if (!isMounted) return;
    if (typeof window === "undefined") return;

    const initSocket = async () => {
      const { getSocket } = await import("@/lib/socket");
      const socket = getSocket();

      socket.on("new-assignment", (deliveryAssignment) => {
        setAssignments((prev) => [...prev, deliveryAssignment]);
      });

      return () => socket.off("new-assignment");
    };

    initSocket();
  }, [isMounted]);

  // ✅ FIXED: Listen for delivery boy location updates
  useEffect((): any => {
    if (!isMounted) return;
    if (typeof window === "undefined") return;

    const initSocket = async () => {
      const { getSocket } = await import("@/lib/socket");
      const socket = getSocket();

      socket.on("update-deliveryBoy-location", ({ userId, location }) => {
        setDeliveryBoyLocation({
          latitude: location.coordinates[1],
          longitude: location.coordinates[0],
        });
      });

      return () => socket.off("update-deliveryBoy-location");
    };

    initSocket();
  }, [isMounted]);

  // ✅ UPDATED: Handle accept with double-click prevention
  const handleAccept = async (assignmentId: string) => {
    // Prevent multiple clicks
    if (acceptingId) return;

    setAcceptingId(assignmentId);
    try {
      const result = await axios.post(
        `/api/delivery/assignment/${assignmentId}/accept-assignment`
      );
      console.log("result is: ", result);

      // Remove accepted assignment from list
      setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));

      // Refresh current order to show the accepted delivery
      await fetchCurrentOrder();
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Failed to accept assignment";
      alert(errorMessage);
    } finally {
      setAcceptingId(null);
    }
  };

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order");
      if (result.data.active) {
        setActiveOrder(result.data.assignment);
        setUserLocation({
          latitude: result.data.assignment.orderId.deliveryAddress.latitude,
          longitude: result.data.assignment.orderId.deliveryAddress.longitude,
        });
      } else {
        setActiveOrder(null);
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isMounted) {
      fetchCurrentOrder();
      fetchAssignments();
    }
  }, [userData, isMounted]);

  const sendOtp = async () => {
    setSendOtpLoading(true);
    setOtpError(""); // Clear previous errors
    try {
      const result = await axios.post("/api/delivery/otp/send", {
        orderId: activeOrder.orderId._id,
      });
      console.log(result.data);
      setShowOtpBox(true);
      setSendOtpLoading(false);
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP. Please try again.";
      setOtpError(errorMessage);
      setSendOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setVerifyOtpLoading(true);
    setOtpError(""); // Clear previous errors
    try {
      const result = await axios.post("/api/delivery/otp/verify", {
        orderId: activeOrder.orderId._id,
        otp,
      });
      console.log(result.data);
      setShowOtpBox(false);
      setOtp("");
      setVerifyOtpLoading(false);
      await fetchCurrentOrder();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "OTP verification failed";
      setOtpError(errorMessage);
      console.log(error);
      setVerifyOtpLoading(false);
    }
  };

  // Don't render until mounted
  if (!isMounted) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  console.log("active order is ", activeOrder);

  // Active delivery view
  if (activeOrder && userLocation) {
    return (
      <div className="p-4 pt-[120px] min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Active Delivery
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            order#{activeOrder.orderId._id.slice(-6)}
          </p>

          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>

          <DeliveryChat
            orderId={activeOrder.orderId._id}
            deliveryBoyId={userData?._id!}
          />

          <div className="mt-6 bg-white rounded-xl border shadow p-6">
            {/* Show "Mark as Delivered" button */}
            {!activeOrder.orderId.deliveryOtpVerification && !showOtpBox && (
              <button
                onClick={sendOtp}
                disabled={sendOtpLoading}
                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                {sendOtpLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Mark as Delivered"
                )}
              </button>
            )}

            {/* Show OTP input box */}
            {showOtpBox && !activeOrder.orderId.deliveryOtpVerification && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 4-digit OTP sent to customer
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-center text-lg font-semibold tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="••••"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                      setOtp(value);
                      setOtpError(""); // Clear error on input
                    }}
                  />
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                  onClick={verifyOtp}
                  disabled={verifyOtpLoading || otp.length !== 4}
                >
                  {verifyOtpLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
                {otpError && (
                  <div className="text-red-600 text-sm text-center font-medium bg-red-50 p-3 rounded-lg">
                    {otpError}
                  </div>
                )}
              </div>
            )}

            {/* Show success message */}
            {activeOrder.orderId.deliveryOtpVerification && (
              <div className="text-green-700 text-center font-bold text-lg py-4 bg-green-50 rounded-lg">
                ✓ Delivery Completed Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Assignments list view
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mt-[120px] mb-[30px]">
          Delivery Assignments
        </h2>

        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">No pending assignments</p>
            <p className="text-gray-400 text-sm mt-2">
              New orders will appear here automatically
            </p>
          </div>
        ) : (
          assignments.map((a) => {
            const order = a.orderId;
            const isAccepting = acceptingId === a._id;

            return (
              <div
                key={a._id}
                className="p-5 bg-white rounded-xl shadow mb-4 border hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-lg font-semibold">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.paymentMethod === "cod" ? "💵 Cash on Delivery" : "💳 Paid Online"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    📍 Delivery Address
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                    {order.deliveryAddress.pincode}
                  </p>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    onClick={() => handleAccept(a._id)}
                    disabled={isAccepting || !!acceptingId}
                  >
                    {isAccepting ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Accepting...
                      </>
                    ) : (
                      "✓ Accept"
                    )}
                  </button>
                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
                    disabled={!!acceptingId}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;