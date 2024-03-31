import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from './../../store/index'
import { Toaster } from "sonner";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        {/* Favicon links */}
        <link rel="icon" href="/logo.png" sizes="64x64"  />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        <Head>
          <title>NoDoseOff</title>
        </Head>
      </Head>
      <Toaster position="top-center" richColors={true} closeButton={true} />
      <Component {...pageProps} />
    </Provider>
  );
}
