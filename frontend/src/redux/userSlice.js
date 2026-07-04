import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    allUsers: null,
    selectedUser: null,
    socket: null,
    onlineUsers: null,
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
    updateUserLastMessage: (state, action) => {
      const { userId, lastMessage, lastMessageAt, unreadCount } =
        action.payload;

      state.allUsers = state.allUsers
        ?.map((user) => {
          if (String(user._id) !== String(userId)) return user;

          return {
            ...user,
            lastMessage: lastMessage ?? user.lastMessage,
            lastMessageAt: lastMessageAt ?? user.lastMessageAt,
            unreadCount:
              unreadCount !== undefined ? unreadCount : user.unreadCount || 0,
          };
        })
        .sort((a, b) => {
          return (
            new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)
          );
        });
    },
  },
});

export const {
  setUserData,
  setAllUser,
  setSelectedUser,
  setSocket,
  setOnlineUsers,
  updateUserLastMessage,
} = userSlice.actions;
export default userSlice.reducer;
