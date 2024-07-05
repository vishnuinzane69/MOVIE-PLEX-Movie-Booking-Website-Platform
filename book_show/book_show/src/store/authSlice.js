import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isSuperuser: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isSuperuser = action.payload.isSuperuser;
      const userData = {
        user: action.payload.user,
        isSuperuser: action.payload.isSuperuser,
      };
      window.localStorage.setItem("user", JSON.stringify(userData));
    },
    removeUser: (state) => {
      state.user = null;
      state.isSuperuser = false;
      window.localStorage.removeItem("user");
    },
    setUserFromLocalStorage: (state) => {
      const userData = window.localStorage.getItem("user");
      if (userData) {
        const { user, isSuperuser } = JSON.parse(userData);
        state.user = user;
        state.isSuperuser = isSuperuser;
      } else {
        state.user = null;
        state.isSuperuser = false;
      }
    },
  },
});

export const { setUser, removeUser, setUserFromLocalStorage } =
  authSlice.actions;

export default authSlice.reducer;