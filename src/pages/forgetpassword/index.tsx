import Link from "next/link";
import SeoHead from "@/components/seo/SeoHead";
import InteractiveLogo from "@/components/ui/InteractiveLogo";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "@/lib/notify";
import { recaptchaSiteKey } from "@/lib/captcha";
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
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = recaptchaSiteKey();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!captchaToken) {
      setErrorMessage("Please complete the CAPTCHA verification.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          captchaToken,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        setErrorMessage(body.error || "Could not send reset email");
        captchaRef.current?.reset();
        setCaptchaToken("");
        return;
      }
      setSent(true);
      toast.success(
        body.message ||
          "Password reset email sent. Please check your inbox."
      );
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      captchaRef.current?.reset();
      setCaptchaToken("");
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

      <SoftPage whims>
        <div className="flex min-h-screen items-center justify-center p-5 ss:p-8">
          <div className="w-full max-w-[420px]">
            <div className="mb-8 flex justify-center">
              <InteractiveLogo
                variant="blue"
                width={160}
                height={48}
                imgClassName="h-10 w-auto"
              />
            </div>

            <SoftCard className="p-7 ss:p-9">
              <p className="mb-2 text-[13px] font-medium text-soft-muted">
                Account recovery
              </p>
              <h1 className="text-[28px] font-bold tracking-tight text-soft-ink">
                Forgot password
              </h1>
              <p className="mt-2 mb-7 text-[15px] leading-relaxed text-soft-muted">
                Enter your email and we&apos;ll send a link to reset — or set —
                a password. Google sign-up accounts can create one here too, or
                keep using{" "}
                <Link href="/login" className="font-semibold text-soft-ink underline">
                  Continue with Google
                </Link>
                .
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

                  {siteKey ? (
                    <div className="flex justify-center overflow-hidden rounded-soft-md">
                      <ReCAPTCHA
                        ref={captchaRef}
                        sitekey={siteKey}
                        onChange={(token) => setCaptchaToken(token || "")}
                        onExpired={() => setCaptchaToken("")}
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-soft-pink-ink">
                      Captcha is not configured. Add{" "}
                      <code>NEXT_PUBLIC_CAPTCHA_SITE_KEY</code> to enable password
                      reset.
                    </p>
                  )}

                  {errorMessage && (
                    <div className="rounded-soft-md border border-soft-pink bg-soft-pink px-4 py-3 text-sm text-soft-pink-ink">
                      {errorMessage}
                    </div>
                  )}

                  <SoftButton
                    type="submit"
                    className="w-full"
                    disabled={loading || !siteKey}
                  >
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
