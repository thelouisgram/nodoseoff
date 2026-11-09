import Link from "next/link";
import { SoftButton, SoftCard, SoftPage } from "@/components/ui/soft";

export default function NotFoundView() {
  return (
    <SoftPage>
      <div className="flex min-h-screen items-center justify-center px-4">
        <SoftCard className="max-w-md p-8 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-soft-muted">
            404
          </p>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight text-soft-ink">
            Page not found
          </h1>
          <p className="mt-2 text-[14px] text-soft-muted">
            That link doesn&apos;t lead anywhere in NoDoseOff.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/">
              <SoftButton type="button" className="w-full">
                Back home
              </SoftButton>
            </Link>
            <Link
              href="/login"
              className="rounded-xl px-4 py-3 text-[14px] font-semibold text-soft-primary transition hover:bg-soft-primary-soft"
            >
              Sign in
            </Link>
          </div>
        </SoftCard>
      </div>
    </SoftPage>
  );
}
