import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  surname: "",
  username: "",
  JwtToken: "",
  term: "",
  isInstructor: true,
  isLoading: false,
  isFailed: false,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startLoginProcess: (state) => {
      state.isLoading = true;
    },
    successLogin: (state, action) => {
      state.isLoading = false;
      state.username = action.payload.username;
      state.name = action.payload.name;
      state.surname = action.payload.surname;
      state.isFailed = false;
      state.isLoggedIn = true;
      state.isInstructor = action.payload.isInstructor;
      state.JwtToken = action.payload.jwtToken;
    },
    failLogin: (state) => {
      state.isFailed = true;
      state.isLoading = false;
      state.isLoggedIn = false;
    },
    logout: (state) => {
      state.name = "";
      state.surname = "";
      state.username = "";
      state.JwtToken = "";
      state.isLoading = false;
      state.isFailed = false;
      state.isLoggedIn = false;
    },
    switchIsInstructor: (state) => {
      state.isInstructor = !state.isInstructor;
    },
    setTerm: (state, action) => {
      state.term = action.payload.term;
    },
  },
});

console.log(userSlice);

export const { startLoginProcess, successLogin, failLogin, logout, switchIsInstructor, setTerm } = userSlice.actions;

export default userSlice.reducer;
