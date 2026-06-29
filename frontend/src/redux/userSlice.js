import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    allUsers: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setAllUser: (state, action) => {
      state.allUsers = action.payload;
    },
  },
});

export const { setUserData, setAllUser } = userSlice.actions;
export default userSlice.reducer;
