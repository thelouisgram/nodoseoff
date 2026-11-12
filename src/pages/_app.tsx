import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster, toast } from "sonner";
import Head from "next/head";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "../contexts/AuthContext";
import { store, persistor } from "../store";
import AuthListener from "../store/AuthListener";
import { useEffect } from "react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import VisitBeacon from "@/components/analytics/VisitBeacon";
import CookieConsent from "@/components/legal/CookieConsent";
import { SoftButton, SoftCard, SoftPage } from "@/components/ui/soft";
import { manrope } from "@/lib/fonts";

function ForceLightMode() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
    // Manrope CSS var must live on <html> so portaled menus match the app font
    root.classList.add(manrope.variable);
    try {
      localStorage.removeItem("theme");
    } catch {
      /* ignore */
    }
  }, []);
  return null;
}

function UnhandledRejectionToaster() {
  useEffect(() => {
    const onRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      toast.error("Something went wrong. Please try again.");
    };
    window.addEventListener("unhandledrejection", onRejection);
    return () => window.removeEventListener("unhandledrejection", onRejection);
  }, []);
  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#002860" />
        <meta
          name="description"
          content="Track medications, get smart dose reminders, and stay on top of long-term treatment with NoDoseOff."
        />
      </Head>
      <div className={`${manrope.variable} font-sans antialiased`}>
        <Toaster position="top-center" richColors closeButton />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ForceLightMode />
            <UnhandledRejectionToaster />
            <AuthListener />
            <VisitBeacon />
            <CookieConsent />
            <AuthProvider>
              <ErrorBoundary
                label="root"
                fallback={({ reset }) => (
                  <SoftPage>
                    <div className="flex min-h-screen items-center justify-center px-4">
                      <SoftCard className="max-w-md p-8 text-center">
                        <h1 className="text-[28px] font-bold tracking-tight text-soft-ink">
                          Something went wrong
                        </h1>
                        <p className="mt-2 text-[14px] text-soft-muted">
                          The app hit an unexpected error.
                        </p>
                        <SoftButton
                          type="button"
                          className="mt-6 w-full"
                          onClick={() => {
                            reset();
                            window.location.reload();
                          }}
                        >
                          Reload
                        </SoftButton>
                      </SoftCard>
                    </div>
                  </SoftPage>
                )}
              >
                <Component {...pageProps} />
              </ErrorBoundary>
            </AuthProvider>
          </PersistGate>
        </Provider>
      </div>
    </>
  );
}
