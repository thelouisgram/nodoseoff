import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import SeoHead from "@/components/seo/SeoHead";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import {
  SoftButton,
  SoftCard,
  SoftInput,
  SoftLabel,
  SoftPage,
} from "@/components/ui/soft";

const ResetPassword = () => {
  const router = useRouter();
  const token = useMemo(() => {
    const q = router.query.token;
    return typeof q === "string" ? q : Array.isArray(q) ? q[0] : "";
  }, [router.query.token]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setErrorMessage("Missing reset token. Request a new reset link.");
      return;
    }
    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in both password fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage(
        "Please enter a password that is at least 8 characters long."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });
      if (error) {
        setErrorMessage(error.message || "Could not reset password");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : `Error updating password: ${err}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SeoHead
        title="Reset password"
        description="Choose a new password for your NoDoseOff account."
        path="/reset"
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
                Security
              </p>
              <h1 className="text-[28px] font-bold tracking-tight text-soft-ink">
                Reset password
              </h1>
              <p className="mt-2 mb-7 text-[15px] leading-relaxed text-soft-muted">
                Choose a new password for your account.
              </p>

              {!token && !success ? (
                <p className="mb-4 text-sm text-soft-pink-ink">
                  Missing or invalid reset token.{" "}
                  <Link href="/forgetpassword" className="underline">
                    Request a new link
                  </Link>
                  .
                </p>
              ) : null}

              {success ? (
                <p className="text-sm text-soft-mint-ink">
                  Password updated. Redirecting to sign in…
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <SoftLabel>New password</SoftLabel>
                    <div className="relative">
                      <SoftInput
                        type={showPassword ? "text" : "password"}
                        className="pr-12"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setPassword(e.target.value)
                        }
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-soft-muted"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <SoftLabel>Confirm password</SoftLabel>
                    <div className="relative">
                      <SoftInput
                        type={showConfirmPassword ? "text" : "password"}
                        className="pr-12"
                        value={confirmPassword}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setConfirmPassword(e.target.value)
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-soft-muted"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="rounded-soft-md border border-soft-pink bg-soft-pink px-4 py-3 text-sm text-soft-pink-ink">
                      {errorMessage}
                    </div>
                  )}

                  <SoftButton
                    type="submit"
                    disabled={loading || !token}
                    className="w-full"
                  >
                    {loading ? "Updating…" : "Reset password"}
                  </SoftButton>
                </form>
              )}
            </SoftCard>
          </div>
        </div>
      </SoftPage>
    </>
  );
};

export default ResetPassword;
