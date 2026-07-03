import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    allUsers: null,
    selectedUser: null,
    socket:null,
    onlineUsers:null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setAllUser: (state, action) => {
      state.allUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
     setSocket: (state, action) => {
      state.socket = action.payload;
    },
     setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setUserData, setAllUser, setSelectedUser,setSocket,setOnlineUsers } = userSlice.actions;
export default userSlice.reducer;
