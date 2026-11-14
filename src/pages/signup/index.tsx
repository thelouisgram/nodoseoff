"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/router";
import { apiJson } from "@/lib/api-client";
import SeoHead from "@/components/seo/SeoHead";
import ReCAPTCHA from "react-google-recaptcha";
import { sendMail } from "@/utils/sendEmail";
import { generateWelcomeEmail } from "@/emails/welcomeMail";
import { useAuthSignUp } from "@/contexts/AuthContext";
import { useGuestOnlyRedirect } from "@/hooks/useGuestOnlyRedirect";
import Loader from "@/components/dashboard/Loader";
import { EyeOff, Eye } from "lucide-react";
import { useAppDispatch } from "@/store";
import { setIsAuthenticated, setUserId } from "@/store/appSlice";
import { motion } from "framer-motion";
import InteractiveLogo from "@/components/ui/InteractiveLogo";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { recaptchaSiteKey } from "@/lib/captcha";
import { verifyCaptchaClient } from "@/lib/captcha-client";
import { waitForAccessToken } from "@/lib/auth/client";
import {
  SoftButton,
  SoftCard,
  SoftInput,
  SoftLabel,
  SoftPage,
} from "@/components/ui/soft";

const CreateAccount = () => {
  const router = useRouter();
  const { signUp, signUpWithGoogle, ready } = useAuthSignUp();
  const { loading: authLoading, isRedirecting, isGuest } = useGuestOnlyRedirect();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const siteKey = recaptchaSiteKey();
  const captchaRef = useRef<ReCAPTCHA>(null);
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setErrorMessage("");
    try {
      await signUpWithGoogle();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Google sign-up failed.";
      setErrorMessage(message);
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!siteKey) {
      setErrorMessage("Captcha is not configured. Please try again later.");
      return;
    }
    if (!captchaToken) {
      setErrorMessage("Please complete the CAPTCHA verification.");
      return;
    }
    if (Object.values(formData).some((field) => field === "")) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 8) {
      setErrorMessage("Please enter a password that is at least 8 characters long.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const captcha = await verifyCaptchaClient(captchaToken);
      if (!captcha.ok) {
        setErrorMessage(captcha.error);
        captchaRef.current?.reset();
        setCaptchaToken("");
        setLoading(false);
        return;
      }

      const { user: signedUpUser, error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (signUpError || !signedUpUser) {
        setErrorMessage(
          "Error signing up: " + (signUpError?.message || "Sign up failed.")
        );
        captchaRef.current?.reset();
        setCaptchaToken("");
        setLoading(false);
        return;
      }

      const userId = signedUpUser.id;
      dispatch(setUserId(userId));
      dispatch(setIsAuthenticated(true));

      const jwt = await waitForAccessToken(8, 250);
      if (!jwt) {
        setErrorMessage(
          "Your account was created but sign-in is still finishing. Please sign in to continue."
        );
        setLoading(false);
        return;
      }

      await apiJson("/api/users/bootstrap", {
        method: "POST",
        json: {
          name: formData.fullName,
          phone: formData.phoneNumber,
          email: formData.email,
        },
      });

      try {
        const { html, subject } = generateWelcomeEmail();
        await sendMail(formData.email, html, subject);
      } catch (mailError) {
        console.warn("Welcome email failed:", mailError);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Unexpected error:", error);
      const detail = error instanceof Error ? error.message : "Unknown error";
      let friendly = detail;
      try {
        const parsed = JSON.parse(detail) as { error?: string };
        if (parsed.error) friendly = parsed.error;
      } catch {
        /* not JSON */
      }
      if (friendly.includes("Unauthorized") || detail.includes("401")) {
        friendly =
          "Your account was created but we could not save your profile. Sign in and try again.";
      }
      setErrorMessage(friendly || "An unexpected error occurred. Please try again.");
      captchaRef.current?.reset();
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || isRedirecting || !isGuest) {
    return <Loader />;
  }

  return (
    <>
      <SeoHead
        title="Create account"
        description="Create a free NoDoseOff account to track medications, get dose reminders, and stay consistent."
        path="/signup"
      />

      <SoftPage whims>
        <div className="flex min-h-screen items-center justify-center p-5 ss:p-8">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[440px]"
          >
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
                Get started
              </p>
              <h2 className="text-[28px] font-bold tracking-tight text-soft-ink">
                Create account
              </h2>
              <p className="mb-7 mt-2 text-[15px] leading-relaxed text-soft-muted">
                Start a calm medication plan you can actually stick with.
              </p>

              <div className="mb-4 space-y-4">
                <GoogleSignInButton
                  onClick={handleGoogle}
                  loading={googleLoading}
                  label="Sign up with Google"
                />
                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-black/[0.06]" />
                  <span className="mx-3 flex-shrink text-[12px] font-medium uppercase tracking-wide text-soft-muted">
                    or email
                  </span>
                  <div className="flex-grow border-t border-black/[0.06]" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {(
                  [
                    { id: "fullName", label: "Full name", type: "text", placeholder: "Your name" },
                    { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
                    { id: "phoneNumber", label: "Phone", type: "tel", placeholder: "Phone number" },
                  ] as const
                ).map((field) => (
                  <div key={field.id}>
                    <SoftLabel htmlFor={field.id}>{field.label}</SoftLabel>
                    <SoftInput
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.id]}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ))}

                <div>
                  <SoftLabel htmlFor="password">Password</SoftLabel>
                  <div className="relative">
                    <SoftInput
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pr-12"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-soft-muted hover:text-soft-ink"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <SoftLabel htmlFor="confirmPassword">Confirm password</SoftLabel>
                  <div className="relative">
                    <SoftInput
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-12"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-soft-muted hover:text-soft-ink"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="rounded-soft-md border border-soft-pink bg-soft-pink px-4 py-3 text-sm text-soft-pink-ink">
                    {errorMessage}
                  </div>
                )}

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
                    <code>NEXT_PUBLIC_CAPTCHA_SITE_KEY</code> to enable signup.
                  </p>
                )}

                <p className="text-[12px] leading-relaxed text-soft-muted">
                  By creating an account you agree to our{" "}
                  <Link href="/terms" className="font-semibold text-soft-ink underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-semibold text-soft-ink underline">
                    Privacy Policy
                  </Link>
                  .
                </p>

                <SoftButton
                  type="submit"
                  className="w-full"
                  disabled={loading || !ready || !siteKey}
                >
                  {loading ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    "Create account"
                  )}
                </SoftButton>

                <p className="pt-1 text-center text-[14px] text-soft-muted">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-soft-ink hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </SoftCard>
          </motion.div>
        </div>
      </SoftPage>
    </>
  );
};

export default CreateAccount;
