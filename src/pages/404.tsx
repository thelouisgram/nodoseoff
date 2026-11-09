import SeoHead from "@/components/seo/SeoHead";
import NotFoundView from "@/components/NotFoundView";

export default function NotFoundPage() {
  return (
    <>
      <SeoHead
        title="Page not found"
        description="This NoDoseOff page does not exist. Head home or sign in to your dashboard."
        path="/404"
        noIndex
      />
      <NotFoundView />
    </>
  );
}
