import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define a type for the auth state
interface AuthState {
  token: string;
  user: string; // You might want to use a more structured type for the user (e.g., `User`)
}

// Initial state
const initialState: AuthState = {
  token: "",
  user: "",
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to handle user registration (e.g., after signup)
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    // Action to handle user login (e.g., after successful login)
    userLoggedIn: (
      state,
      action: PayloadAction<{ accessToken: string; user: string }>
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    // Action to handle user logout
    userLoggedOut: (state) => {
      state.token = "";
      state.user = "";
    },
  },
});

// Export actions and reducer
export const { userRegistration, userLoggedIn, userLoggedOut } =
  authSlice.actions;

export default authSlice.reducer;
