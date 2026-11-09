import Image from "next/image";
import Link from "next/link";
import SeoHead from "@/components/seo/SeoHead";
import { ChangeEvent, FormEvent, useState } from "react";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";
import {
  SoftButton,
  SoftCard,
  SoftInput,
  SoftLabel,
  SoftPage,
} from "@/components/ui/soft";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset`
          : "/reset";
      const { error } = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo,
      });
      if (error) {
        setErrorMessage(error.message || "Could not send reset email");
        return;
      }
      setSent(true);
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SeoHead
        title="Forgot password"
        description="Reset your NoDoseOff password securely via email."
        path="/forgetpassword"
        noIndex
      />

      <SoftPage>
        <div className="flex min-h-screen items-center justify-center p-5 ss:p-8">
          <div className="w-full max-w-[420px]">
            <Link href="/" className="mb-8 flex justify-center">
              <Image
                src="/assets/logo/logo-with-name-blue.png"
                width={160}
                height={48}
                alt="NoDoseOff logo"
                className="h-10 w-auto"
              />
            </Link>

            <SoftCard className="p-7 ss:p-9">
              <p className="mb-2 text-[13px] font-medium text-soft-muted">
                Account recovery
              </p>
              <h1 className="text-[28px] font-bold tracking-tight text-soft-ink">
                Forgot password
              </h1>
              <p className="mt-2 mb-7 text-[15px] leading-relaxed text-soft-muted">
                Enter your email and we&apos;ll send a calm reset link.
              </p>

              {sent ? (
                <div className="space-y-5">
                  <p className="text-[15px] leading-relaxed text-soft-muted">
                    If an account exists for{" "}
                    <span className="font-semibold text-soft-ink">{email}</span>,
                    you will receive a reset link shortly.
                  </p>
                  <Link href="/login">
                    <SoftButton type="button" className="w-full">
                      Back to sign in
                    </SoftButton>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <SoftLabel htmlFor="email">Email</SoftLabel>
                    <SoftInput
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      required
                    />
                  </div>

                  {errorMessage && (
                    <div className="rounded-soft-md border border-soft-pink bg-soft-pink px-4 py-3 text-sm text-soft-pink-ink">
                      {errorMessage}
                    </div>
                  )}

                  <SoftButton type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending…" : "Send reset link"}
                  </SoftButton>

                  <p className="pt-2 text-center text-[14px]">
                    <Link
                      href="/login"
                      className="font-semibold text-soft-ink hover:underline"
                    >
                      Back to sign in
                    </Link>
                  </p>
                </form>
              )}
            </SoftCard>
          </div>
        </div>
      </SoftPage>
    </>
  );
};

export default ForgotPassword;
