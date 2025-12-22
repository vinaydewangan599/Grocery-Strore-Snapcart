import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery {
    _id:mongoose.Types.ObjectId,
    name:string,
    category:string,
    price:string ,
    unit:string,
    image:string,
    quantity:number
    
}
interface IcartSlice {
  cartData: IGrocery[],
  subTotal: number,
  discount: number,
  totalAmount: number,
  deliveryCharge: number


}

const initialState: IcartSlice = {
  cartData: [],
  subTotal: 0,
  discount: 0,
  deliveryCharge: 40,
  totalAmount: 40
};
     
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
   addToCart: (state, action: PayloadAction<IGrocery>) => {
        state.cartData?.push(action.payload);
        cartSlice.caseReducers.calculateTotals(state);
      },
    increaseQuantity: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
        const item = state.cartData.find((cartItem) => cartItem._id.toString() === action.payload.toString());
        if (item) {
          item.quantity += 1;
        }
        cartSlice.caseReducers.calculateTotals(state);
      },
    decreaseQuantity: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
        const item = state.cartData.find((cartItem) => cartItem._id.toString() === action.payload.toString());
        if (item && item.quantity > 1) {
          item.quantity -= 1;
        } else{
            state.cartData = state.cartData.filter((cartItem) => cartItem._id.toString() !== action.payload.toString());
        }
        cartSlice.caseReducers.calculateTotals(state);
      },
      removeFromCart: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
        state.cartData = state.cartData.filter((cartItem) => cartItem._id.toString() !== action.payload.toString());
        cartSlice.caseReducers.calculateTotals(state);
      },
      calculateTotals: (state) => {
        state.subTotal = state.cartData.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
        state.deliveryCharge = state.subTotal > 100 ? 0 : 40;
        state.totalAmount = state.subTotal + state.deliveryCharge;
      },
     
  }
});

export const {addToCart, increaseQuantity, decreaseQuantity, removeFromCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;