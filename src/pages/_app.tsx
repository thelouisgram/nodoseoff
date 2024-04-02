import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "./../../store/index";
import { Toaster } from "sonner";
import Head from "next/head";
import { useState, useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [mode, setMode] = useState("light");

  useEffect(() => {
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

    const systemColorScheme = getSystemColorScheme();
    setMode(systemColorScheme);
  }, []);

  return (
    <Provider store={store}>
      <Head>
        {/* Favicon links */}
        <link
          rel="icon"
          href={mode === "dark" ? "/logo-white.png" : "/logo-blue.png"}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={mode === "dark" ? "/logo-white.png" : "/logo-blue.png"}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={mode === "dark" ? "/logo-white.png" : "/logo-blue.png"}
        />
        <title>NoDoseOff</title>
      </Head>
      <Toaster position="top-center" richColors={true} closeButton={true} />
      <Component {...pageProps} />
    </Provider>
  );
}
