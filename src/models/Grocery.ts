import mongoose from "mongoose";

interface IGrocery extends Document{
    
    name:string,
    category:string,
    price:string ,
    unit:string,
    image:string,
    
}

const GrocerySchema = new mongoose.Schema<IGrocery>({
    name:{
        type:String,
        required:true
    },
    category: {
        type: String,
        enum: [
            "Fruits & Vegetables",
            "Dairy & Eggs",
            "Rice, Atta & Grains",
            "Snacks & Biscuits",
            "Spices & Masalas",
            "Beverages & Drinks",
            "Personal Care",
            "Household Essentials",
            "Instant & Packaged Food",
            "Baby & Pet Care"
        ],
        required: true  
    },
    price:{
        type:String,
        required:true
    },
    unit:{
        type:String,
        required:true,
        enum:[
            "kg",
            "grams",
            "litre",
            "piece",
            "ml",
            "pack"
        ]
    },
    image:{
        type:String,
        required:true
    }
},{timestamps:true});

const Grocery =  mongoose.models.Grocery || mongoose.model<IGrocery>("Grocery",GrocerySchema);
export default Grocery;
