import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SignInState = {
  email: string;
  password: string;
  jwtToken: string;
};

const initialState: SignInState = {
  email: "",
  password: "",
  jwtToken: "",
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
    setJwtToken: (state, action) => {
      state.jwtToken = action.payload;
    },
    clearSignInState: (state) => {
      state.email = "";
      state.password = "";
      state.jwtToken = "";
    },
  },
});

export const { setEmail, setPassword, clearSignInState, setJwtToken } =
  signInSlice.actions;
export default signInSlice.reducer;
