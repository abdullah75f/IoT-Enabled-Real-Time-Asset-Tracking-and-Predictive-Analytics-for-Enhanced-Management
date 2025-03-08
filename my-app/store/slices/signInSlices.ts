import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SignInState = {
  email: string;
  password: string;
  jwtToken: string | null;
  user: {
    userId: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    age: string;
    address: string;
    profilePicture: string | null;
    lastUpdatedAt: string;
  };
  isAuthenticated: boolean;
};

const initialState: SignInState = {
  email: "",
  password: "",
  jwtToken: null,
  user: {
    userId: null,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    age: "",
    address: "",
    profilePicture: null,
    lastUpdatedAt: "",
  },
  isAuthenticated: false,
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
    setJwtToken: (state, action: PayloadAction<string>) => {
      state.jwtToken = action.payload;
    },
    setSignInData: (
      state,
      action: PayloadAction<{ jwtToken: string; user: SignInState["user"] }>
    ) => {
      state.jwtToken = action.payload.jwtToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    clearSignInState: (state) => {
      state.email = "";
      state.password = "";
      state.jwtToken = "";
      state.user = {
        userId: null,
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        age: "",
        address: "",
        profilePicture: null,
        lastUpdatedAt: "",
      };
      state.isAuthenticated = false;
    },
  },
});

export const {
  setEmail,
  setPassword,
  setSignInData,
  clearSignInState,
  setJwtToken,
} = signInSlice.actions;
export default signInSlice.reducer;
