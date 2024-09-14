import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

// Define the API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI, // Make sure the environment variable is correctly set
    credentials: "include", // Include credentials for cookie-based authentication
  }),
  endpoints: (builder) => ({
    // Define refreshToken endpoint (optional)
    refreshToken: builder.query({
      query: () => ({
        url: "refresh",
        method: "GET",
        credentials: "include", // Include credentials to refresh token
      }),
    }),

    // Define loadUser endpoint
    loadUser: builder.query({
      query: () => ({
        url: "me", // Ensure this is the correct API endpoint
        method: "GET",
      }),
      // Handling the response and dispatching the user data
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // Dispatch userLoggedIn action with the accessToken and user data
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken, // Make sure this is the correct token field
              user: result.data.user,
            })
          );
        } catch (error: any) {
          // Log error for debugging purposes
          console.error("Error fetching user data:", error);
        }
      },
    }),
  }),
});

// Export hooks for the defined endpoints
export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
