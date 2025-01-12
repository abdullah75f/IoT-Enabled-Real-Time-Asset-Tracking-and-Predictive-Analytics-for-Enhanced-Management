// redux/slices/forgotPasswordSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ForgotPasswordState = {
  email: string;
};

const initialState: ForgotPasswordState = {
  email: "",
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearForgotPasswordState: (state) => {
      state.email = "";
    },
  },
});

export const { setEmail, clearForgotPasswordState } =
  forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
