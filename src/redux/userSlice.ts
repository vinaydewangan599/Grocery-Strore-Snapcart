import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Frontend User Type (no mongoose document properties)
interface UserData {
  _id: string;
  name: string;
  email: string;
  image?: string;
  mobile?: string;
  address?: string;
  role: "USER" | "ADMIN" | "DELIVERY";
  provider: "credentials" | "google";
  isVerified: boolean;
}

interface UserState {
  userData: UserData | null;
}

const initialState: UserState = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
    }
  }
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
