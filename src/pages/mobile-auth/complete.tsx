import dynamic from "next/dynamic";
import Head from "next/head";

const MobileGoogleCompleteClient = dynamic(
  () => import("@/components/auth/MobileGoogleCompleteClient"),
  {
    ssr: false,
    loading: () => (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f7f8fa",
          color: "#5c6b7a",
        }}
      >
        <p>Returning to NodoseOff…</p>
      </main>
    ),
  }
);

export default function MobileGoogleCompletePage() {
  return (
    <>
      <Head>
        <title>Returning to NodoseOff</title>
        <meta name="robots" content="noindex" />
      </Head>
      <MobileGoogleCompleteClient />
    </>
  );
}
