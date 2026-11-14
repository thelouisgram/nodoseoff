import React, { FormEvent, useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "@/lib/notify";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { authClient } from "@/lib/auth/client";
import { apiJson } from "@/lib/api-client";
import { useAppDispatch } from "@/store";
import { resetAppState } from "@/store/appSlice";
import { clearDashboardData } from "@/store/dashboardSlice";

interface DeleteAccountProps {
  setActiveModal: (value: string) => void;
  activeModal: string;
}

const CONFIRMATION_WORD = "DELETE";

const DeleteAccount: React.FC<DeleteAccountProps> = ({
  setActiveModal,
  activeModal,
}) => {
  const router = useRouter();
  const { signOut } = useAuth();
  const dispatch = useAppDispatch();
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    if (loading) return;
    setActiveModal("");
    setConfirmation("");
    setErrorMessage("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (confirmation !== CONFIRMATION_WORD) {
      setErrorMessage(`Type ${CONFIRMATION_WORD} to confirm.`);
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      await apiJson<{ message?: string }>("/api/deleteUser", {
        method: "POST",
      });
      try {
        await authClient.deleteUser();
      } catch {
        /* auth user may already be gone */
      }
      dispatch(clearDashboardData());
      dispatch(resetAppState());
      try {
        await signOut();
      } catch {
        /* session already cleared */
      }
      toast.success("Your account has been deleted.");
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete account";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (activeModal !== "deleteAccount") return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-black/[0.05] bg-white shadow-soft-md"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Delete Account
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-14 w-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle size={28} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              This permanently deletes your profile, medications, reminders, and
              reports. This action cannot be undone.
            </p>
          </div>
          <label className="block">
            <span className="text-sm text-gray-600">
              Type{" "}
              <span className="font-semibold text-gray-900">
                {CONFIRMATION_WORD}
              </span>{" "}
              to confirm
            </span>
            <input
              value={confirmation}
              onChange={(e) => {
                setConfirmation(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              disabled={loading}
              autoComplete="off"
              className="mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder={CONFIRMATION_WORD}
            />
          </label>
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading || confirmation !== CONFIRMATION_WORD}
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full bg-gray-100 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount;
