import dynamic from "next/dynamic";
import Loader from "@/components/dashboard/Loader";
import SeoHead from "@/components/seo/SeoHead";

const MobileGoogleAuthClient = dynamic(
  () => import("@/components/auth/MobileGoogleAuthClient"),
  { ssr: false, loading: () => <Loader label="Preparing Google sign-in…" /> }
);

export default function MobileGoogleAuthPage() {
  return (
    <>
      <SeoHead
        title="Sign in with Google"
        description="Google sign-in for the NodoseOff mobile app."
        path="/mobile-auth/google"
        noIndex
      />
      <MobileGoogleAuthClient />
    </>
  );
}