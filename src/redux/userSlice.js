import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  surname: "",
  username: "",
  JwtToken: "",
  term: "",
  id: 0,
  isInstructor: true,
  isLoading: false,
  isFailed: false,
  isLoggedIn: false,
  isTranscriptUploded:false,
  showTerms: true,
  notificationPreference: null,
  unreadNotifications: 0
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
      state.id = action.payload.id;
      state.isFailed = false;
      state.isLoggedIn = true;

      state.isInstructor = action.payload.isInstructor;
      state.JwtToken = action.payload.jwtToken;
      state.notificationPreference = action.payload.notificationPreference
    },
    failLogin: (state) => {
      state.isFailed = true;
      state.isLoading = false;
      state.isLoggedIn = false;
    },

    uploadedTranscript:(state)=>{
      state.isTranscriptUploded=true;
    },

    logout: (state) => {
      state.name = "";
      state.surname = "";
      state.username = "";
      state.JwtToken = "";
      state.id = 0;
      state.isLoading = false;
      state.isFailed = false;
      state.isLoggedIn = false;
      state.notificationPreference = null
    },
    switchIsInstructor: (state) => {
      state.isInstructor = !state.isInstructor;
    },
    setTerm: (state, action) => {
      state.term = action.payload.term;
    },
    flipShowTerms: (state) => {
      state.showTerms = !state.showTerms
    },
    setNotificationPreference: (state, action) => {
      state.notificationPreference = action.payload.notificationPreference
    },
    setUnreadNotificationCount: (state, action) => {
      state.unreadNotifications = action.payload.unreadNotifications
    },
    increaseUnreadNotificationCountByOne: (state) => {
      state.unreadNotifications = state.unreadNotifications + 1
    }
  },
});

console.log(userSlice);

export const {
  increaseUnreadNotificationCountByOne,
  setUnreadNotificationCount,
  setNotificationPreference,
  flipShowTerms,
  startLoginProcess,
  successLogin,
  failLogin,
  logout,
  switchIsInstructor,
  setTerm,
  uploadedTranscript} = userSlice.actions;

export default userSlice.reducer;
