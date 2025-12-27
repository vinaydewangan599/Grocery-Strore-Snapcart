// 'use client'
// import React, { use, useEffect } from 'react'
// import { motion } from 'motion/react'
// import { ArrowLeft, User,MapPin, Phone, Home, Building, Navigation, Search } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import { useSelector } from 'react-redux'
// import { RootState } from '@/redux/store'
// import { useState } from 'react'

// const checkout = () => {
//     const router = useRouter();
//     const {userData} = useSelector((state: RootState) => state.user); //fetch user data from redux or context
//     const [address, setAddress] = useState({
//             name: "",
//             mobile: "",
//             city: '',
//             state: '',
//             pincode: '',
//             fullAddress: ''
//     });
//     const [position, setPosition] = useState<{lat: number, lng: number} | null>(null);
//    useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition((pos) => {
//                 const coords = {
//                     lat: pos.coords.latitude,
//                     lng: pos.coords.longitude
//                 };
//                 setPosition(coords);
//                 console.log("Correct position:", coords); // FIXED
//             });
//         }
//     }, []);

//     useEffect(() => {
//     if (userData) {
//         setAddress(prev => ({
//             ...prev,
//             name: userData.name || "",
//             mobile: userData.mobile || "",
//             fullAddress: userData.address || "",
//         }));
//     }
// }, [userData]);

//   return (
//     <div className='w-[92%] md:w-[80%] mx-auto py-10 relative'>
//     <motion.button
//         whileTap={{scale:0.97}}
//         className='absolute left-0 top-2 flex items-center gap-2
//         text-green-700 hover:text-green-800 font-semibold'
//         onClick={() => router.push("/user/cart")}
//     >
//         <ArrowLeft size={16}/>
//         <span>Back to cart</span>
//     </motion.button>
//    <motion.h1
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className='text-3xl md:text-4xl font-bold text-green-700 text-center mb-10'
//     >Checkout</motion.h1>

//     <div className='grid md:grid-cols-2 gap-8'>
//         <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.3 }}
//             className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100'
//         >
//             <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
//                 <MapPin className='text-green-700'/> Delivery Address
//             </h2>
//             <div className='space-y-4'>
//                 <div className='relative'>
//                     <User className="absolute left-3 top-3 text-green-600" size={18}/>
//                     <input type="text" value={address.name} onChange={(e)=>setAddress({...address, name: e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
//                 </div>
//                 <div className='relative'>
//                     <Phone className="absolute left-3 top-3 text-green-600" size={18}/>
//                     <input type="text" value={address.mobile} onChange={(e)=>setAddress({...address, mobile: e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
//                 </div>
//                 <div className='relative'>
//                     <Home className="absolute left-3 top-3 text-green-600" size={18}/>
//                     <input type="text" value={address.fullAddress} placeholder='Full Address' onChange={(e)=>setAddress({...address, fullAddress: e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
//                 </div>
//                 <div className='grid grid-cols-3 gap-3'>
//                     <div className='relative'>
//                         <Building className="absolute left-3 top-3 text-green-600" size={18}/>
//                         <input type="text" value={address.city} placeholder='city' onChange={(e)=> setAddress({...address,city:e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
//                     </div>
//                     <div className='relative'>
//                         <Navigation className="absolute left-3 top-3 text-green-600" size={18}/>
//                         <input type="text" value={address.state} placeholder='state' onChange={(e)=> setAddress({...address,state:e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
//                     </div>
//                     <div className='relative'>
//                         <Search className="absolute left-3 top-3 text-green-600" size={18}/>
//                         <input type="text" value={address.pincode} placeholder='pincode' onChange={(e)=> setAddress({...address,pincode:e.target.value})} className='pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50'/>
//                     </div>
//                 </div>
//                 <div className='flex gap-2 mt-3'>
//                     <input type="text" placeholder='search city or area...' className='flex-1
//                         border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500
//                         outline-none'/>
//                     <button className='bg-green-600 text-white px-5 rounded-lg
//                         hover:bg-green-700 transition-all font-medium'>Search</button>
//                 </div>
//             </div>
//         </motion.div>
//     </div>
// </div>
//   )
// }

// export default checkout

// "use client";
// import React, { use, useEffect, useState } from "react";
// import { motion } from "motion/react";
// import {
//   ArrowLeft,
//   User,
//   MapPin,
//   Phone,
//   Home,
//   Building,
//   Navigation,
//   Search,
//   LocateFixed,
//   Loader2,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import "leaflet/dist/leaflet.css";
// import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
// import L, { LatLngExpression, marker } from "leaflet";
// import axios from "axios";
// import { OpenStreetMapProvider } from "leaflet-geosearch";

// const markerIcon = L.icon({
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   shadowSize: [41, 41],
// });

// const Checkout = () => {
//   const router = useRouter();
//   const { userData } = useSelector((state: RootState) => state.user);

//   const [address, setAddress] = useState({
//     name: "",
//     mobile: "",
//     city: "",
//     state: "",
//     pincode: "",
//     fullAddress: "",
//   });

//   const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
//     null
//   );
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchLoading, setSearchLoading] = useState(false);  

//   // -----------------------------
//   // Handle All Inputs in One Function
//   // -----------------------------
//   const handleChange = (key: string, value: string) => {
//     setAddress((prev) => ({ ...prev, [key]: value }));
//   };

//   // -----------------------------
//   // Get Current Location
//   // -----------------------------
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const coords = {
//             lat: pos.coords.latitude,
//             lng: pos.coords.longitude,
//           };
//           setPosition(coords);
//           console.log("Correct position:", coords);
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//         },
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//       );
//     }
//   }, []);

//   // -----------------------------
//   // Auto-fill values from userData
//   // -----------------------------
//   useEffect(() => {
//     if (userData) {
//       setAddress((prev) => ({
//         ...prev,
//         name: userData.name || "",
//         mobile: userData.mobile || "",
//         fullAddress: userData.address || "",
//       }));
//     }
//   }, [userData]);

//   const DraggableMarker: React.FC = () => {
//     const map = useMap();
//     useEffect(() => {
//       map.setView(position as LatLngExpression,15, { animate: true });
//     }, [position, map]);
//     return (
//       <Marker
//         icon={markerIcon}
//         position={position as LatLngExpression}
//         draggable={true}
//         eventHandlers={{
//           dragend: (e: L.LeafletEvent) => {
//             const marker = e.target as L.Marker;
//             const latLng = marker.getLatLng();
//             setPosition({ lat: latLng.lat, lng: latLng.lng });
//             console.log("Marker dragged to:", latLng);
//           }
//         }}
//       />
//     );
//   };

//   useEffect(() => {
//     const fetchAddress = async () => {
//       try {
//         if (position) {
//           const response = await axios.get(
//             `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.lat}&lon=${position.lng}`
//           );
//           const data = await response.data;
//           console.log("Fetched address data:", data);
//           setAddress((prev) => ({
//             ...prev,
//             city: data.address.city || "",
//             state: data.address.state || "",
//             pincode: data.address.postcode || "",
//             fullAddress: data.display_name || "",
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching address:", error);
//       }
//     };
    
//     fetchAddress();
      
//   },[position]);

//  const handleSearchQuery=async () => {
//     setSearchLoading(true);
//     const provider=new OpenStreetMapProvider()
//     const results = await provider.search({ query: searchQuery });
//     if(results){
//       setSearchLoading(false);
//       setPosition({ lat: results[0].y, lng: results[0].x });
//     }

//   };
//   const handleCurrentLocation = () => {
    
//   };

//   return (
//     <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
//       <motion.button
//         whileTap={{ scale: 0.97 }}
//         className="absolute left-0 top-2 flex items-center gap-2
//         text-green-700 hover:text-green-800 font-semibold"
//         onClick={() => router.push("/user/cart")}
//       >
//         <ArrowLeft size={16} />
//         <span>Back to cart</span>
//       </motion.button>

//       <motion.h1
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
//       >
//         Checkout
//       </motion.h1>

//       <div className="grid md:grid-cols-2 gap-8">
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.3 }}
//           className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
//         >
//           <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//             <MapPin className="text-green-700" /> Delivery Address
//           </h2>

//           <div className="space-y-4">
//             {/* Name */}
//             <div className="relative">
//               <User
//                 className="absolute left-3 top-3 text-green-600"
//                 size={18}
//               />
//               <input
//                 type="text"
//                 value={address.name}
//                 onChange={(e) => handleChange("name", e.target.value)}
//                 className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
//                 placeholder="Full Name"
//               />
//             </div>

//             {/* Mobile */}
//             <div className="relative">
//               <Phone
//                 className="absolute left-3 top-3 text-green-600"
//                 size={18}
//               />
//               <input
//                 type="text"
//                 value={address.mobile}
//                 onChange={(e) => handleChange("mobile", e.target.value)}
//                 className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
//                 placeholder="Mobile Number"
//               />
//             </div>

//             {/* Full Address */}
//             <div className="relative">
//               <Home
//                 className="absolute left-3 top-3 text-green-600"
//                 size={18}
//               />
//               <input
//                 type="text"
//                 value={address.fullAddress}
//                 onChange={(e) => handleChange("fullAddress", e.target.value)}
//                 className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
//                 placeholder="Full Address"
//               />
//             </div>

//             {/* City, State, Pincode */}
//             <div className="grid grid-cols-3 gap-3">
//               <div className="relative">
//                 <Building
//                   className="absolute left-3 top-3 text-green-600"
//                   size={18}
//                 />
//                 <input
//                   type="text"
//                   value={address.city}
//                   onChange={(e) => handleChange("city", e.target.value)}
//                   className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
//                   placeholder="City"
//                 />
//               </div>

//               <div className="relative">
//                 <Navigation
//                   className="absolute left-3 top-3 text-green-600"
//                   size={18}
//                 />
//                 <input
//                   type="text"
//                   value={address.state}
//                   onChange={(e) => handleChange("state", e.target.value)}
//                   className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
//                   placeholder="State"
//                 />
//               </div>

//               <div className="relative">
//                 <Search
//                   className="absolute left-3 top-3 text-green-600"
//                   size={18}
//                 />
//                 <input
//                   type="text"
//                   value={address.pincode}
//                   onChange={(e) => handleChange("pincode", e.target.value)}
//                   className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
//                   placeholder="Pincode"
//                 />
//               </div>
//             </div>

//             {/* Search Field */}
//             <div className="flex gap-2 mt-3">
//               <input
//                 type="text"
//                 placeholder="Search city or area..."
//                 className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <button className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium" onClick={handleSearchQuery}>
//                 {searchLoading ? <Loader2 size={16} className="animate-spin"/> : "Search"}
//               </button>
//             </div>

//             {/* You can add more fields or a submit button here if needed */}
//             <div
//               className="relative mt-6 h-[330px] rounded-xl overflow-hidden border
//                     border-gray-200 shadow-inner"
//             >
//               {position && (
//                 <MapContainer
//                   center={position as LatLngExpression}
//                   zoom={13}
//                   scrollWheelZoom={true}
//                   className="w-full h-full"
//                 >
//                   <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   />
//                   <DraggableMarker />
//                 </MapContainer>
//               )}
//               <motion.div>
//                 <motion.button
//                   whileTap={{scale:0.93}}
//                   className='absolute bottom-4 right-4 bg-green-600 text-white shadow-lg
//                   rounded-full p-3 hover:bg-green-700 transition-all flex items-center
//                   justify-center z-999'
//                   onClick={handleCurrentLocation}
//                   >

//                   <LocateFixed size={22}/>
//                   </motion.button>
//               </motion.div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;


'use client'
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Home,
  Building,
  Navigation,
  Search,
  LocateFixed,
  Loader2,
  CreditCard,
  CreditCardIcon,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import axios from "axios";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const Checkout = () => {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const {subTotal,deliveryCharge,totalAmount,cartData } = useSelector((state: RootState) => state.cart);

  const [address, setAddress] = useState({
    name: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("cod");  

  // -----------------------------
  // Handle Inputs
  // -----------------------------
  const handleChange = (key: string, value: string) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  // -----------------------------
  // Initial Location Fetch
  // -----------------------------
  useEffect(() => {
    handleCurrentLocation();
  }, []);

  // -----------------------------
  // Autofill user details
  // -----------------------------
  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        name: userData.name || "",
        mobile: userData.mobile || "",
        fullAddress: userData.address || "",
      }));
    }
  }, [userData]);

  // -----------------------------
  // Draggable Marker
  // -----------------------------
  const DraggableMarker: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.setView(position as LatLngExpression, 15, { animate: true });
      }
    }, [position, map]);

    return (
      <Marker
        icon={markerIcon}
        position={position as LatLngExpression}
        draggable
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const latLng = marker.getLatLng();
            setPosition({ lat: latLng.lat, lng: latLng.lng });
          },
        }}
      />
    );
  };

  // -----------------------------
  // Reverse Geocoding
  // -----------------------------
  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return;

      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.lat}&lon=${position.lng}`
        );

        const data = res.data;

        console.log(data);

        setAddress((prev) => ({
          ...prev,
          city: data.address.city || data.address.town || "",
          state: data.address.state || "",
          pincode: data.address.postcode || "",
          fullAddress: data.display_name || "",
        }));
      } catch (err) {
        console.error("Reverse geocode failed:", err);
      }
    };

    fetchAddress();
  }, [position]);

  // -----------------------------
  // Search Address
  // -----------------------------
  const handleSearchQuery = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: searchQuery });

      if (results.length > 0) {
        setPosition({ lat: results[0].y, lng: results[0].x });
      }
    } finally {
      setSearchLoading(false);
    }
  };

  // -----------------------------
  // ✅ CURRENT LOCATION BUTTON
  // -----------------------------
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationLoading(false);
      },
      (error) => {
        console.error("Location error:", error);
        alert("Unable to fetch location. Please enable GPS or try again.");
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  // -----------------------------
  // Handle Payment Method : COD
  // -----------------------------
const handleCod = async () => {
  try {
    const res = await axios.post("/api/user/order", {
      userId: userData?._id,

      items: cartData.map((item) => ({
        groceryId: item._id, // ✅ FIXED
        name: item.name,
        price: item.price,
        unit: item.unit,
        quantity: item.quantity,
        image: item.image,
      })),

      deliveryAddress: { // ✅ FIXED KEY
        name: address.name,
        mobile: address.mobile,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        address: address.fullAddress, // ✅ FIXED
        // latitude: position?.lat?.toString(),
        // longitude: position?.lng?.toString(),
        latitude: position ? position.lat.toString() : "",
        longitude: position ? position.lng.toString() : "",

      },

      paymentMethod: "cod",
      totalAmount,
    });

    console.log("Order placed:", res.data);
    router.push("/user/order-success");
  } catch (error: any) {
    console.error("Order placement failed:", error.response?.data || error);
  }
};

  // -----------------------------
  // Handle Payment Method : ONLINE
  // -----------------------------
const handleOnlineOrder = async () => {
  try{
    const res = await axios.post("/api/user/payment", {
      userId: userData?._id,

      items: cartData.map((item) => ({
        groceryId: item._id, // ✅ FIXED
        name: item.name,
        price: item.price,
        unit: item.unit,
        quantity: item.quantity,
        image: item.image,
      })),

      deliveryAddress: { // ✅ FIXED KEY
        name: address.name,
        mobile: address.mobile,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        address: address.fullAddress, // ✅ FIXED
        latitude: position?.lat?.toString(),
        longitude: position?.lng?.toString(),
      },

      paymentMethod: "online",
      totalAmount,
    });

    console.log("Payment initiated:", res.data);
    window.location.href = res.data.paymentUrl;
  } catch(error){
    console.error("Online order failed:", error);
  }
};


  return (
   <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="absolute left-0 top-2 flex items-center gap-2
        text-green-700 hover:text-green-800 font-semibold"
        onClick={() => router.push("/user/cart")}
      >
        <ArrowLeft size={16} />
        <span>Back to cart</span>
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
      >
        Checkout
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-green-700" /> Delivery Address
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                placeholder="Full Name"
              />
            </div>

            {/* Mobile */}
            <div className="relative">
              <Phone
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                placeholder="Mobile Number"
              />
            </div>

            {/* Full Address */}
            <div className="relative">
              <Home
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.fullAddress}
                onChange={(e) => handleChange("fullAddress", e.target.value)}
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                placeholder="Full Address"
              />
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <Building
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                  placeholder="City"
                />
              </div>

              <div className="relative">
                <Navigation
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                  placeholder="State"
                />
              </div>

              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                  placeholder="Pincode"
                />
              </div>
            </div>

            {/* Search Field */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Search city or area..."
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium" onClick={handleSearchQuery}>
                {searchLoading ? <Loader2 size={16} className="animate-spin"/> : "Search"}
              </button>
            </div>

            {/* You can add more fields or a submit button here if needed */}
            <div
              className="relative mt-6 h-[330px] rounded-xl overflow-hidden border
                    border-gray-200 shadow-inner"
            >
              {position && (
                <MapContainer
                  center={position as LatLngExpression}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <DraggableMarker />
                </MapContainer>
              )}
              <motion.div>
                <motion.button
                  whileTap={{scale:0.93}}
                  className='absolute bottom-4 right-4 bg-green-600 text-white shadow-lg
                  rounded-full p-3 hover:bg-green-700 transition-all flex items-center
                  justify-center z-999'
                  onClick={handleCurrentLocation}
                  >

                  <LocateFixed size={22}/>
                  </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all
          duration-300 p-6 border border-gray-100 h-fit'
        >
          <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center
          gap-2'><CreditCard className='text-green-600'/> Payment Method</h2>
          <div className='space-y-4 mb-6'>
              <button onClick={()=>{setPaymentMethod("online")}}
              className={`flex items-center gap-3 w-full border rounded-lg p-3
              transition-all ${
              paymentMethod === "online"
                ? "border-green-600 bg-green-50 shadow-sm"
                : "hover:bg-gray-50"
              }`}>
                <CreditCardIcon className='text-green-600'/><span className='font-medium
                text-gray-700'>Pay Online (stripe)</span>
              </button>
              <button onClick={()=>{setPaymentMethod("cod")}}
              className={`flex items-center gap-3 w-full border rounded-lg p-3
              transition-all ${
              paymentMethod === "cod"
                ? "border-green-600 bg-green-50 shadow-sm"
                : "hover:bg-gray-50"
              }`}>
             
                <Truck className='text-green-600'/><span className='font-medium
                text-gray-700'>Cash on Delivery</span>
              </button>
          </div>
          <div className='border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base'>
            <div className='flex justify-between'>
              <span>Subtotal</span>
              <span>₹{subTotal}</span>
            </div>
            <div className='flex justify-between'>
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className='flex justify-between font-semibold text-lg'>
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
          
          <motion.button whileTap={{scale:0.93}} className='w-full mt-6 bg-green-600
            text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold'
            onClick={()=>{
              if(paymentMethod=="cod"){
                handleCod();
              } else{
                handleOnlineOrder()
                
              }
            }}>
            {paymentMethod=="cod"?"Place Order":"pay & Place Order"}
          </motion.button>
         
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
