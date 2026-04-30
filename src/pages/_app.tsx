import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import Head from "next/head";
import { useState } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Dynamically set favicon links based on the mode */}
        <link rel="icon" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        <title>NoDoseOff - Drug Tracking and Reminder App</title>
      </Head>
      <Toaster position="top-center" richColors={true} closeButton={true} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
