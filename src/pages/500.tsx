import Link from "next/link";
import SeoHead from "@/components/seo/SeoHead";
import { SoftButton, SoftCard, SoftPage } from "@/components/ui/soft";

export default function ServerErrorPage() {
  return (
    <SoftPage>
      <SeoHead
        title="Something went wrong"
        description="NoDoseOff hit an unexpected error. Please try again shortly."
        path="/500"
        noIndex
      />
      <div className="flex min-h-screen items-center justify-center px-4">
        <SoftCard className="max-w-md p-8 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-soft-muted">
            500
          </p>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight text-soft-ink">
            Something went wrong
          </h1>
          <p className="mt-2 text-[14px] text-soft-muted">
            We hit an unexpected error. Try again in a moment.
          </p>
          <Link href="/dashboard" className="mt-6 block">
            <SoftButton type="button" className="w-full">
              Go to dashboard
            </SoftButton>
          </Link>
        </SoftCard>
      </div>
    </SoftPage>
  );
}
