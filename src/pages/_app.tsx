import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "./../../store/index";
import { Toaster } from "sonner";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    // Function to get the system's preferred color scheme
    function getSystemColorScheme() {
      if (window.matchMedia) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
          return "light";
        }
      }
      return "light";
    }

    // Set the mode state based on the system's color scheme
    const systemColorScheme = getSystemColorScheme();
    setMode(systemColorScheme);
  }, []);

  return (
    <Provider store={store}>
      <Head>
        {/* Dynamically set favicon links based on the mode */}
        <link
          rel="icon"
          href="/logo.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/logo.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/logo.png" 
        />
        <title>NoDoseOff - Drug Tracking and Reminder App</title>
      </Head>
      <Toaster position="top-center" richColors={true} closeButton={true} />
      <Component {...pageProps} />
    </Provider>
  );
}