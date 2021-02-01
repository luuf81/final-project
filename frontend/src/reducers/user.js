import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client"

const initialState = {
  users: [],
  login: {
    accessToken: localStorage.accessToken || null,
    userId: localStorage.userId || 0,
    statusMessage: "",
  },
};

let socket

export const user = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setAccessToken: (state, action) => {
      const { accessToken } = action.payload;
      console.log(`Access Token: ${accessToken}`);
      state.login.accessToken = accessToken;
      localStorage.setItem('accessToken', accessToken)
    },
    setUserId: (state, action) => {
      const { userId } = action.payload;
      console.log(`User Id: ${userId}`);
      state.login.userId = userId;
      localStorage.setItem('userId', userId)
    },
    setStatusMessage: (state, action) => {
      const { statusMessage } = action.payload;
      console.log(`Status Message: ${statusMessage}`);
      state.login.statusMessage = statusMessage;
    },
    logout: (state, action) => {
      console.log("Logging out");
      state.login.userId = 0;
      state.login.accessToken = null;
    },
  },
});

export const fetchUsers = () => {
  return (dispatch) => {
      //console.log(localStorage.getItem('accessToken'))
      fetch("http://localhost:8080/users", {
          method: 'GET',
          headers: { Authorization: localStorage.getItem('accessToken') },
        })
      .then(res => res.json())
      .then((users) => {
          dispatch(user.actions.setUsers(users))
      })
}}

// export const socketEvents = () => {
//   return(dispatch) => {
//   if(!socket) {
//     socket = io('http://localhost:3001')
//     socket.on()
//     console.log(socket)
//   }
// }}