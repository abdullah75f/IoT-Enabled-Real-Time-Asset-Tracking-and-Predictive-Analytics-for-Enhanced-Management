// src/store/slices/signUpSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SignUpState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: "male" | "female";
  age: string;
  password: string;
  confirmPassword: string;
  selectedOption: "email" | "phone";
};

const initialState: SignUpState = {
  fullName: "",
  email: "",
  phoneNumber: "",
  gender: "male",
  age: "",
  password: "",
  confirmPassword: "",
  selectedOption: "email",
};

const signUpSlice = createSlice({
  name: "signUp",
  initialState,
  reducers: {
    setFullName: (state, action: PayloadAction<string>) => {
      state.fullName = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setGender: (state, action: PayloadAction<"male" | "female">) => {
      state.gender = action.payload;
    },
    setAge: (state, action: PayloadAction<string>) => {
      state.age = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setSelectedOption: (state, action: PayloadAction<"email" | "phone">) => {
      state.selectedOption = action.payload;
    },
  },
});

export const {
  setFullName,
  setEmail,
  setPhoneNumber,
  setGender,
  setAge,
  setPassword,
  setSelectedOption,
  setConfirmPassword,
} = signUpSlice.actions;

export default signUpSlice.reducer;
