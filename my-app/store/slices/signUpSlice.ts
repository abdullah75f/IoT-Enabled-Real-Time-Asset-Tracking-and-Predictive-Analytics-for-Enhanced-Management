import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SignUpState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: "Male" | "Female";
  age: string;
  address: string;
  password: string;
  confirmPassword: string;
  selectedOption: "email" | "phone";
  passwordMismatchError: boolean;
};

const initialState: SignUpState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  gender: "Male",
  age: "",
  address: "",
  password: "",
  confirmPassword: "",
  selectedOption: "email",
  passwordMismatchError: false,
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
    setGender: (state, action: PayloadAction<"Male" | "Female">) => {
      state.gender = action.payload;
    },
    setAge: (state, action: PayloadAction<string>) => {
      state.age = action.payload;
    },
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setPasswordMismatchError: (state, action) => {
      state.passwordMismatchError = action.payload;
    },
    setSelectedOption: (state, action: PayloadAction<"email" | "phone">) => {
      state.selectedOption = action.payload;
    },
    // updateSignUpData: (state, action: PayloadAction<SignUpState>) => {
    //   const {
    //     firstName,
    //     lastName,
    //     email,
    //     phoneNumber,
    //     gender,
    //     age,
    //     address,
    //     password,
    //     confirmPassword,
    //     selectedOption,
    //   } = action.payload;
    //   state.firstName = firstName;
    //   state.lastName = lastName;
    //   state.email = email;
    //   state.phoneNumber = phoneNumber;
    //   state.gender = gender;
    //   state.age = age;
    //   state.address = address;
    //   state.password = password;
    //   state.confirmPassword = confirmPassword;
    //   state.selectedOption = selectedOption;
    // },
  },
});

export const {
  setFirstName,
  setLastName,
  setEmail,
  setPhoneNumber,
  setGender,
  setAge,
  setAddress,
  setPassword,
  setSelectedOption,
  setConfirmPassword,
  setPasswordMismatchError,
  // updateSignUpData,
} = signUpSlice.actions;

export default signUpSlice.reducer;
