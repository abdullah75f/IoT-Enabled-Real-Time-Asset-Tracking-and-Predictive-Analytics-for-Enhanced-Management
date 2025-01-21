import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SignUpState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: "male" | "female";
  age: string;
  password: string;
  confirmPassword: string;
  selectedOption: "email" | "phone";
};

const initialState: SignUpState = {
  firstName: "",
  lastName: "",
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
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
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
    updateSignUpData: (state, action: PayloadAction<SignUpState>) => {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        gender,
        age,
        password,
        confirmPassword,
        selectedOption,
      } = action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.phoneNumber = phoneNumber;
      state.gender = gender;
      state.age = age;
      state.password = password;
      state.confirmPassword = confirmPassword;
      state.selectedOption = selectedOption;
    },
  },
});

export const {
  setFirstName,
  setLastName,
  setEmail,
  setPhoneNumber,
  setGender,
  setAge,
  setPassword,
  setSelectedOption,
  setConfirmPassword,
  updateSignUpData, 

} = signUpSlice.actions;

export default signUpSlice.reducer;
