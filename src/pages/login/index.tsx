import Image from "next/image";
import Link from "next/link";
import SeoHead from "@/components/seo/SeoHead";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useAuthSignIn } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { SignUpLink } from "@/components/auth/SignUpLink";
import { useGuestOnlyRedirect } from "@/hooks/useGuestOnlyRedirect";
import Loader from "@/components/dashboard/Loader";
import {
  SoftButton,
  SoftCard,
  SoftInput,
  SoftLabel,
  SoftPage,
} from "@/components/ui/soft";

const SignIn = () => {
  const router = useRouter();
  const { signIn, signInWithGoogle, ready } = useAuthSignIn();
  const { loading: authLoading, isRedirecting, isGuest } = useGuestOnlyRedirect();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.password || !formData.email) {
      setErrorMessage("Input Email & Password");
      return;
    }
    setFormSubmitting(true);
    setErrorMessage("");
    try {
      await signIn(formData.email, formData.password);
      await router.replace("/dashboard");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred during sign in.";
      setErrorMessage("Error signing in: " + message);
      setFormSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setErrorMessage("");
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Google sign-in failed.";
      setErrorMessage(message);
      setGoogleLoading(false);
    }
  };

  if (authLoading || isRedirecting || !isGuest) {
    return <Loader />;
  }

  return (
    <>
      <SeoHead
        title="Log in"
        description="Sign in to NoDoseOff to manage medications, dose reminders, and adherence reports."
        path="/login"
      />

      <SoftPage>
        <div className="min-h-screen flex items-center justify-center p-5 ss:p-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-full max-w-[420px]"
          >
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
              <div className="mb-7">
                <p className="mb-2 text-[13px] font-medium text-soft-muted">
                  Welcome back
                </p>
                <h1 className="text-[28px] font-bold tracking-tight text-soft-ink">
                  Sign in
                </h1>
                <p className="mt-2 text-[15px] leading-relaxed text-soft-muted">
                  Continue managing your medications with a calm, clear day plan.
                </p>
              </div>

              <div className="mb-5 space-y-4">
                <GoogleSignInButton onClick={handleGoogle} loading={googleLoading} />
                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-black/[0.06]" />
                  <span className="mx-3 flex-shrink text-[12px] font-medium uppercase tracking-wide text-soft-muted">
                    or email
                  </span>
                  <div className="flex-grow border-t border-black/[0.06]" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <SoftLabel htmlFor="email">Email</SoftLabel>
                  <SoftInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <SoftLabel htmlFor="password">Password</SoftLabel>
                  <div className="relative">
                    <SoftInput
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pr-12"
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

                {errorMessage && (
                  <div className="rounded-soft-md border border-soft-pink bg-soft-pink px-4 py-3 text-sm text-soft-pink-ink">
                    {errorMessage}
                  </div>
                )}

                <div className="flex justify-end">
                  <Link
                    href="/forgetpassword"
                    className="text-[13px] font-semibold text-soft-ink/70 hover:text-soft-ink"
                  >
                    Forgot password?
                  </Link>
                </div>

                <SoftButton
                  type="submit"
                  className="w-full"
                  disabled={formSubmitting || !ready}
                >
                  {formSubmitting ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    "Sign in"
                  )}
                </SoftButton>
              </form>

              <p className="mt-6 text-center text-[14px] text-soft-muted">
                Don&apos;t have an account?{" "}
                <SignUpLink className="font-semibold text-soft-ink hover:underline">
                  Create account
                </SignUpLink>
              </p>
            </SoftCard>
          </motion.div>
        </div>
      </SoftPage>
    </>
  );
};

export default SignIn;
