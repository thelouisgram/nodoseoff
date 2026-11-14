/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "@/lib/notify";
import { authClient } from "@/lib/auth/client";
import { apiJson } from "@/lib/api-client";
import { ChevronLeft, X, Loader2 } from "lucide-react";
import { SoftButton, SoftInput } from "@/components/ui/soft";

interface ChangePasswordProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  setActiveModal,
  activeModal,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasPassword, setHasPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (activeModal !== "changePassword") return;
    let cancelled = false;
    (async () => {
      setChecking(true);
      try {
        const data = await apiJson<{ hasPassword?: boolean }>(
          "/api/users/password-status"
        );
        if (!cancelled) setHasPassword(Boolean(data.hasPassword));
      } catch {
        if (!cancelled) setHasPassword(true);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeModal]);

  const handleClose = () => {
    if (!loading) {
      setActiveModal("");
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      setErrorMessage(
        "Please enter a password that is at least 8 characters long."
      );
      return;
    }

    if (hasPassword && !currentPassword) {
      setErrorMessage("Please fill in all password fields.");
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in all password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      if (hasPassword) {
        const { error } = await authClient.changePassword({
          currentPassword,
          newPassword: password,
        });
        if (error) {
          setErrorMessage(error.message || "Error updating password");
          return;
        }
        toast.success("Password updated successfully!");
      } else {
        await apiJson("/api/users/set-password", {
          method: "POST",
          json: { newPassword: password },
        });
        toast.success("Password set — you can also sign in with email now.");
        setHasPassword(true);
      }
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setActiveModal("");
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      let friendly = detail;
      try {
        const parsed = JSON.parse(detail) as { error?: string };
        if (parsed.error) friendly = parsed.error;
      } catch {
        /* not JSON */
      }
      setErrorMessage(friendly || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  if (activeModal !== "changePassword") return null;

  const title = hasPassword ? "Change password" : "Set password";

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md scale-100 rounded-2xl border border-black/[0.05] bg-white opacity-100 shadow-soft-md transition-all duration-200"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <button
            type="button"
            onClick={() => setActiveModal("accountSettings")}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {checking ? (
          <div className="flex items-center justify-center gap-2 p-10 text-soft-muted">
            <Loader2 size={18} className="animate-spin" />
            Loading…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {!hasPassword ? (
              <p className="text-sm leading-relaxed text-gray-600">
                You signed in with Google. Set a password if you also want to
                sign in with email.
              </p>
            ) : null}

            {hasPassword ? (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-soft-ink">
                  Current Password
                </label>
                <SoftInput
                  type="password"
                  value={currentPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setCurrentPassword(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  required
                />
              </div>
            ) : null}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-soft-ink">
                {hasPassword ? "New Password" : "Password"}
              </label>
              <SoftInput
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                minLength={8}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-soft-ink">
                Confirm {hasPassword ? "New " : ""}Password
              </label>
              <SoftInput
                type="password"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setConfirmPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                required
              />
            </div>
            {errorMessage && (
              <p className="text-sm text-soft-pink-ink">{errorMessage}</p>
            )}
            <SoftButton type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {hasPassword ? "Updating..." : "Saving..."}
                </>
              ) : hasPassword ? (
                "Update Password"
              ) : (
                "Set Password"
              )}
            </SoftButton>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
