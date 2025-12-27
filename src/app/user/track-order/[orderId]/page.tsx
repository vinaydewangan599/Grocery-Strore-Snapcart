// 'use client'
// import axios from "axios";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState, useRef } from "react";
// import mongoose, { set } from "mongoose";
// import { IUser } from "@/models/User";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { ArrowLeft ,Loader,Send, Sparkle } from "lucide-react";
// import { getSocket } from "@/lib/socket";
// import LiveMap from "@/components/LiveMap";
// import { AnimatePresence } from "motion/react";
// import Message from "@/models/Message";
// import {motion} from "motion/react"
// import { IMessage } from "@/models/Message";




// interface IOrder{
//     _id?:mongoose.Types.ObjectId,
//     userId:mongoose.Types.ObjectId,
//     items:[
//         {
//             groceryId:mongoose.Types.ObjectId,
//             name:string,
//             quantity:number,
//             price:number,
//             unit:string,
//             image:string 
//         }
//     ],
//     totalAmount:number,  
//     paymentMethod:"cod" | "online",
//     orderStatus:"pending" | "Out of Delivery"  | "delivered" | "cancelled",
//     isPaid:boolean,
//     deliveryAddress:{
//         name:string,
//         mobile:string,
//         city:string,
//         state:string,
//         pincode:string,
//         address:string,
//         latitude?: number;
//         longitude?: number;

//     },
//     assignment?:mongoose.Types.ObjectId,
//     assignDeliveryBoy?:IUser,
//     createdAt?:Date,
//     updatedAt?:Date  
// }

// interface Ilocation{
//     latitude: number
//     longitude: number
// }


// const TrackOrder = ({params}:{params:{orderId:string}}) => {
//   const {userData} = useSelector((state:RootState)=>state.user)
//   const {orderId}=useParams();
//   const [order,setOrder]=useState<IOrder>();
//   const router = useRouter();
//   const [userLocation,setUserLocation]=useState<Ilocation>({latitude:0,longitude:0});
//   const [deliveryBoyLocation,setDeliveryBoyLocation]=useState<Ilocation>({latitude:0,longitude:0});
//   const chatBoxRef = useRef<HTMLDivElement>(null);
//   const [suggestions,setSuggestions]=useState<string[]>(["hello","hii","thank you"]); // ✅ FIX 1: Initialize with default array
//   const [loading,setloading]=useState(false);

//   const [newMessage, setNewMessage] = useState("");
//   const [messages, setMessages] = useState<IMessage[]>([]);

//       useEffect(()=>{
//             const socket=getSocket()
//             socket.emit("join-room",orderId);
//              socket.on("send-message", (message) => {
//               if (message.roomId === orderId) {
//                   setMessages((prev) => [...prev, message])
//               }
//           })
//           return ()=>{
//             socket.off("send-message");
//           }
//         },[orderId])
        
//    const sendMsg= ()=>{
//           if (!newMessage.trim()) return;
          
//           const socket=getSocket()
  
//           const message={
//               roomId:orderId,
//               text:newMessage,
//               senderId:userData?._id,
//               time:new Date().toLocaleTimeString([],{
//                   hour:"2-digit",
//                   minute:"2-digit"
//               })
//           }
//           socket.emit("send-message",message);
         
//           setNewMessage(""); // ✅ CLEAR INPUT AFTER SEND
//     }

//     useEffect(() => {
//         const getAllMessages = async () => {
//             try {
//                 const result = await axios.post("/api/chat/messages", { roomId: orderId })
//                 setMessages(Array.isArray(result.data) ? result.data : [])
//             } catch (error) {
//                 console.log(error)
//                 setMessages([])
//             }
//         }
//         getAllMessages()
//     }, [orderId])

//     useEffect(() => {
//             chatBoxRef.current?.scrollTo({
//                 top: chatBoxRef.current.scrollHeight,
//                 behavior: "smooth"
//             })
//         }, [messages])

//   // ✅ FIX 2: Move getSuggestion function OUTSIDE of useEffect
//   const getSuggestion = async () => {
//         setloading(true);
//         try {
//             const lastMessage = messages?.filter((m) => m.senderId.toString() !== userData?._id)?.at(-1);
//             const result = await axios.post("/api/chat/ai-suggestions", { message: lastMessage?.text, role:"user"});
           
//             // ✅ FIX 3: Ensure result.data is an array
//             setSuggestions(Array.isArray(result.data) ? result.data : ["hello","hii","thank you"])
//             setloading(false);
//         } catch (error) {
//             console.log(error)
//             // Keep default suggestions on error
//             setSuggestions(["hello","hii","thank you"]);
//             setloading(false);
//         }
//     }

//   useEffect(()=>{
//   const getOrder=async ()=>{
//       try {
//           const result=await axios.get(`/api/user/get-order/${orderId}`)
//           setOrder(result.data);
//           setUserLocation({latitude:result.data.deliveryAddress.latitude,longitude:result.data.deliveryAddress.longitude});
//           setDeliveryBoyLocation({latitude:result.data.assignDeliveryBoy.location.coordinates[1],longitude:result.data.assignDeliveryBoy.location.coordinates[0]});
//       } catch (error) {
//           console.log(error)
//       }
//   } 
//     getOrder();
//   },[userData?._id, orderId]);

//  useEffect(():any => {
// const socket = getSocket()
// socket.on("update-deliveryBoy-location", (data) => {
//     console.log(location)
//     setDeliveryBoyLocation({
//         latitude: data.location.coordinates?.[1] ?? data.location.latitude,
//         longitude: data.location.coordinates?.[0] ?? data.location.longitude,

//     })
// })

// return () => socket.off("update-deliveryBoy-location")
// }, [order])

//   return (
//     <div className='w-full min-h-screen bg-linear-to-b from-green-50 to-white'>
//         <div className='max-w-2xl mx-auto pb-24'>
//             <div className='sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-999'>
//                 <button className='p-2 bg-green-100 rounded-full' onClick={()=>router.back()}><ArrowLeft className="text-green-700" size={20}/></button>
//                 <div>
//             <h2 className='text-xl font-bold'>Track Order</h2>
//             <p className='text-sm text-gray-600'>order#{order?._id?.toString().slice(-6)} <span className='text-green-700 font-semibold'>{order?.orderStatus}</span></p>
//                 </div>

//             </div>
//             <div className='px-4 mt-6 space-y-4'>
//                 <div className='rounded-3xl overflow-hidden border shadow'>
//                     <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation}/>
//                 </div>
//                   <div className='bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col'>
                    
//                      <div className='flex justify-between items-center mb-3'>
//                         <span className='font-semibold text-gray-700 text-sm'>Quick Replies</span>
//                         <motion.button
//                             whileTap={{ scale: 0.9 }}
//                             disabled={loading}
//                             onClick={getSuggestion}
//                             className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             <Sparkle size={14}/>{loading? <Loader className='w-5 h-5 animate-spin'/>:" AI suggest"}
//                         </motion.button>
//                     </div>
//                     <div className='flex gap-2 flex-wrap mb-3'>
//                         {suggestions.map((s, i) => (
//                             <motion.div
//                                 key={`${s}-${i}`}
//                                 whileTap={{ scale: 0.92 }}
//                                 className="px-3 py-1 text-xs bg-green-50 border border-green-200 text-green-700 rounded-full cursor-pointer"
//                                 onClick={() => setNewMessage(s)}
//                             >
//                                 {s}
//                             </motion.div>
//                         ))}
//                     </div>


//                         <div className='flex-1 overflow-y-auto p-2 space-y-3' ref = {chatBoxRef}>
//                             <AnimatePresence>
//                                 {messages?.map((msg, index) => (
//                                     <motion.div
//                                         key={msg._id?.toString() || `msg-${index}`}
//                                         initial={{ opacity: 0, y: 15 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         exit={{ opacity: 0 }}
//                                         transition={{ duration: 0.2 }}
//                                         className={`flex ${msg.senderId.toString()==userData?._id ? "justify-end":"justify-start"}`}
//                                     >
//                                         <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow 
//                                             ${msg.senderId.toString() === userData?._id 
//                                                 ? "bg-green-600 text-white rounded-br-none" 
//                                                 : "bg-gray-100 text-gray-800 rounded-bl-none"
//                                             }`}
//                                         >
//                                             <p>{msg.text}</p>
//                                             <p className='text-[10px] opacity-70 mt-1 text-right'>{msg.time}</p>
//                                         </div>
                
//                                     </motion.div>
//                                 ))}
//                             </AnimatePresence>
//                         </div>
                
                
                
//                         <div className='flex gap-2 mt-3 border-t pt-3'>
//                             <input 
//                                 type="text" 
//                                 placeholder='Type a Message...' 
//                                 className='flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500'
//                                 value={newMessage} 
//                                 onChange={(e)=>setNewMessage(e.target.value)}
//                                 onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
//                             />
//                             <button 
//                                 className='bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white'
//                                 onClick={sendMsg} 
//                             >
//                                 <Send size={18}/>
//                             </button>
                            
//                         </div>
                
//                     </div>



//             </div>

//         </div>
//     </div>
//   )
// }

// export default TrackOrder


'use client'
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import mongoose from "mongoose";
import { IUser } from "@/models/User";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ArrowLeft, Loader, Send, Sparkle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { IMessage } from "@/models/Message";
import dynamic from 'next/dynamic';

// ✅ Dynamically import LiveMap with no SSR
const LiveMap = dynamic(() => import("@/components/LiveMap"), { ssr: false });

interface IOrder {
    _id?: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    items: [
        {
            groceryId: mongoose.Types.ObjectId,
            name: string,
            quantity: number,
            price: number,
            unit: string,
            image: string
        }
    ],
    totalAmount: number,
    paymentMethod: "cod" | "online",
    orderStatus: "pending" | "Out of Delivery" | "delivered" | "cancelled",
    isPaid: boolean,
    deliveryAddress: {
        name: string,
        mobile: string,
        city: string,
        state: string,
        pincode: string,
        address: string,
        latitude?: number;
        longitude?: number;
    },
    assignment?: mongoose.Types.ObjectId,
    assignDeliveryBoy?: IUser,
    createdAt?: Date,
    updatedAt?: Date
}

interface Ilocation {
    latitude: number
    longitude: number
}

const TrackOrder = ({ params }: { params: { orderId: string } }) => {
    const { userData } = useSelector((state: RootState) => state.user)
    const { orderId } = useParams();
    const [order, setOrder] = useState<IOrder>();
    const router = useRouter();
    const [userLocation, setUserLocation] = useState<Ilocation>({ latitude: 0, longitude: 0 });
    const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<Ilocation>({ latitude: 0, longitude: 0 });
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const [suggestions, setSuggestions] = useState<string[]>(["hello", "hii", "thank you"]);
    const [loading, setloading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isMounted, setIsMounted] = useState(false); // ✅ Add mounted state

    // ✅ Set mounted state
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // ✅ Socket connection - only run on client
    useEffect(() => {
        if (!isMounted || typeof window === 'undefined') return;

        const initSocket = async () => {
            const { getSocket } = await import("@/lib/socket");
            const socket = getSocket();
            
            socket.emit("join-room", orderId);
            
            socket.on("send-message", (message) => {
                if (message.roomId === orderId) {
                    setMessages((prev) => [...prev, message])
                }
            });

            return () => {
                socket.off("send-message");
            };
        };

        initSocket();
    }, [orderId, isMounted]);

    const sendMsg = async () => {
        if (!newMessage.trim() || typeof window === 'undefined') return;

        const { getSocket } = await import("@/lib/socket");
        const socket = getSocket();

        const message = {
            roomId: orderId,
            text: newMessage,
            senderId: userData?._id,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        }
        socket.emit("send-message", message);
        setNewMessage("");
    }

    useEffect(() => {
        const getAllMessages = async () => {
            try {
                const result = await axios.post("/api/chat/messages", { roomId: orderId })
                setMessages(Array.isArray(result.data) ? result.data : [])
            } catch (error) {
                console.log(error)
                setMessages([])
            }
        }
        getAllMessages()
    }, [orderId])

    useEffect(() => {
        chatBoxRef.current?.scrollTo({
            top: chatBoxRef.current.scrollHeight,
            behavior: "smooth"
        })
    }, [messages])

    const getSuggestion = async () => {
        setloading(true);
        try {
            const lastMessage = messages?.filter((m) => m.senderId.toString() !== userData?._id)?.at(-1);
            const result = await axios.post("/api/chat/ai-suggestions", { message: lastMessage?.text, role: "user" });
            setSuggestions(Array.isArray(result.data) ? result.data : ["hello", "hii", "thank you"])
            setloading(false);
        } catch (error) {
            console.log(error)
            setSuggestions(["hello", "hii", "thank you"]);
            setloading(false);
        }
    }

    useEffect(() => {
        const getOrder = async () => {
            try {
                const result = await axios.get(`/api/user/get-order/${orderId}`)
                setOrder(result.data);
                setUserLocation({ 
                    latitude: result.data.deliveryAddress.latitude, 
                    longitude: result.data.deliveryAddress.longitude 
                });
                setDeliveryBoyLocation({ 
                    latitude: result.data.assignDeliveryBoy.location.coordinates[1], 
                    longitude: result.data.assignDeliveryBoy.location.coordinates[0] 
                });
            } catch (error) {
                console.log(error)
            }
        }
        getOrder();
    }, [userData?._id, orderId]);

    // ✅ Socket listener for location updates - only run on client
    useEffect(() => {
        if (!isMounted || typeof window === 'undefined') return;

        const initLocationSocket = async () => {
            const { getSocket } = await import("@/lib/socket");
            const socket = getSocket();
            
            socket.on("update-deliveryBoy-location", (data) => {
                console.log(data)
                setDeliveryBoyLocation({
                    latitude: data.location.coordinates?.[1] ?? data.location.latitude,
                    longitude: data.location.coordinates?.[0] ?? data.location.longitude,
                })
            });

            return () => socket.off("update-deliveryBoy-location");
        };

        initLocationSocket();
    }, [order, isMounted]);

    // ✅ Show loading state until mounted
    if (!isMounted) {
        return (
            <div className='w-full min-h-screen bg-linear-to-b from-green-50 to-white flex items-center justify-center'>
                <Loader className='w-8 h-8 animate-spin text-green-600' />
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen bg-linear-to-b from-green-50 to-white'>
            <div className='max-w-2xl mx-auto pb-24'>
                <div className='sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3 items-center z-999'>
                    <button className='p-2 bg-green-100 rounded-full' onClick={() => router.back()}>
                        <ArrowLeft className="text-green-700" size={20} />
                    </button>
                    <div>
                        <h2 className='text-xl font-bold'>Track Order</h2>
                        <p className='text-sm text-gray-600'>
                            order#{order?._id?.toString().slice(-6)} 
                            <span className='text-green-700 font-semibold'> {order?.orderStatus}</span>
                        </p>
                    </div>
                </div>
                
                <div className='px-4 mt-6 space-y-4'>
                    <div className='rounded-3xl overflow-hidden border shadow'>
                        <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
                    </div>
                    
                    <div className='bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col'>
                        <div className='flex justify-between items-center mb-3'>
                            <span className='font-semibold text-gray-700 text-sm'>Quick Replies</span>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                disabled={loading}
                                onClick={getSuggestion}
                                className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Sparkle size={14} />
                                {loading ? <Loader className='w-5 h-5 animate-spin' /> : " AI suggest"}
                            </motion.button>
                        </div>
                        
                        <div className='flex gap-2 flex-wrap mb-3'>
                            {suggestions.map((s, i) => (
                                <motion.div
                                    key={`${s}-${i}`}
                                    whileTap={{ scale: 0.92 }}
                                    className="px-3 py-1 text-xs bg-green-50 border border-green-200 text-green-700 rounded-full cursor-pointer"
                                    onClick={() => setNewMessage(s)}
                                >
                                    {s}
                                </motion.div>
                            ))}
                        </div>

                        <div className='flex-1 overflow-y-auto p-2 space-y-3' ref={chatBoxRef}>
                            <AnimatePresence>
                                {messages?.map((msg, index) => (
                                    <motion.div
                                        key={msg._id?.toString() || `msg-${index}`}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`flex ${msg.senderId.toString() == userData?._id ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow 
                                            ${msg.senderId.toString() === userData?._id
                                                ? "bg-green-600 text-white rounded-br-none"
                                                : "bg-gray-100 text-gray-800 rounded-bl-none"
                                            }`}
                                        >
                                            <p>{msg.text}</p>
                                            <p className='text-[10px] opacity-70 mt-1 text-right'>{msg.time}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className='flex gap-2 mt-3 border-t pt-3'>
                            <input
                                type="text"
                                placeholder='Type a Message...'
                                className='flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500'
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
                            />
                            <button
                                className='bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white'
                                onClick={sendMsg}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrackOrder