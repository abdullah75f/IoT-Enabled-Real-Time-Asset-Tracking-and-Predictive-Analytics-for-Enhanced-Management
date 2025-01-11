// redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SignInState = {
  email: string;
  password: string;
};

const initialState: SignInState = {
  email: "",
  password: "",
};

const signInSlice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    clearSignInState: (state) => {
      state.email = "";
      state.password = "";
    },
  },
});

export const { setEmail, setPassword, clearSignInState } = signInSlice.actions;
export default signInSlice.reducer;
