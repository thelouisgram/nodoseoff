import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from './../../store/index'
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Toaster
        position="top-center"
        richColors={true}
        closeButton={true}
      />
      <Component {...pageProps} />
    </Provider>
  );
}
