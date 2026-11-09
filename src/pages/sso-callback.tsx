import dynamic from "next/dynamic";
import Loader from "@/components/dashboard/Loader";
import SeoHead from "@/components/seo/SeoHead";

const SsoCallbackClient = dynamic(
  () => import("@/components/auth/SsoCallbackClient"),
  { ssr: false, loading: () => <Loader /> }
);

export default function SsoCallbackPage() {
  return (
    <>
      <SeoHead
        title="Signing you in"
        description="Completing secure sign-in to NoDoseOff."
        path="/sso-callback"
        noIndex
      />
      <SsoCallbackClient />
    </>
  );
}
