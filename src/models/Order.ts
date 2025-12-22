import mongoose from "mongoose"
export interface IOrder{
    _id?:mongoose.Types.ObjectId,
    userId:mongoose.Types.ObjectId,
    items:[
        {
            groceryId:mongoose.Types.ObjectId,
            name:string,
            quantity:number,
            price:number,
            unit:string,
            image:string 
        }
    ],
    totalAmount:number,  
    paymentMethod:"cod" | "online",
    orderStatus:"pending" | "Out of Delivery"  | "delivered" | "cancelled",
    isPaid:boolean,
    deliveryAddress:{
        name:string,
        mobile:string,
        city:string,
        state:string,
        pincode:string,
        address:string,
        latitude?:string,
        longitude?:string
    },
    assignment?:mongoose.Types.ObjectId,
    assignDeliveryBoy?:mongoose.Types.ObjectId,
    createdAt?:Date,
    updatedAt?:Date  
}
const OrderSchema = new mongoose.Schema<IOrder>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[
        {
            groceryId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Grocery",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            unit:{
                type:String,
                required:true
            },
            image:{
                type:String,
                required:true
            }
        }
    ],
    totalAmount:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        enum:["cod","online"],
        default:"cod"
    },
    orderStatus:{
        type:String,
        enum:["pending","Out of Delivery","delivered","cancelled"],
        default:"pending"
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    assignment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"DeliveryAssignment",
        default:null
    },
    assignDeliveryBoy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    deliveryAddress:{
        name:{
            type:String,
            required:true
        },
        mobile:{
            type:String,
            required:true
        },
        city:{
            type:String
            
        },
        state:{
            type:String
            
        },
        pincode:{
            type:String
            
        },
        address:{
            type:String
              
        },
        latitude:String,
        longitude:String
    }
},{timestamps:true});

const Order =mongoose.models.Order || mongoose.model<IOrder>("Order",OrderSchema);
export default Order;