"use client";

import "./globals.css";
import { Poppins, Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";
import { useEffect } from "react";
import socketIO, { Socket } from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socket: Socket = socketIO(ENDPOINT, { transports: ["websocket"] });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${josefin.variable} bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-[#0d0141] dark:to-[#0d0523] duration-300 min-h-screen`}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>{children}</Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

import { useSession } from "next-auth/react";

const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession(); // Get session status from next-auth
  const { isLoading, data: userData } = useLoadUserQuery({}, { skip: !session });

  // Only initiate the `useLoadUserQuery` if the session exists (i.e., the user is logged in)
  useEffect(() => {
    if (session) {
      socket.on("connection", () => {});
      return () => {
        socket.off("connection");
      };
    }
  }, [session]);

  if (status === "loading" || isLoading) {
    // Show a loading spinner if session or user data is being fetched
    return <Loader />;
  }

  if (!session) {
    // If there's no session, the user is not logged in yet
    return <p>Please log in to continue.</p>;
  }

  return <>{children}</>;
};

