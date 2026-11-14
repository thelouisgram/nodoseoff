import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";

/**
 * Global NoDoseOff toaster — soft card chrome, navy / mint / pink tones.
 * Mount once from `_app`. Call sites use `@/lib/notify`.
 */
export default function AppToaster() {
  return (
    <Toaster
      theme="light"
      position="top-center"
      closeButton
      gap={10}
      offset={16}
      visibleToasts={4}
      expand={false}
      loadingIcon={
        <Loader2
          className="ndo-toast-icon ndo-toast-icon--loading size-[18px]"
          aria-hidden
        />
      }
      toastOptions={{
        className: "ndo-toast",
        classNames: {
          toast: "ndo-toast",
          title: "ndo-toast__title",
          description: "ndo-toast__description",
          actionButton: "ndo-toast__action",
          cancelButton: "ndo-toast__cancel",
          closeButton: "ndo-toast__close",
          success: "ndo-toast--success",
          error: "ndo-toast--error",
          warning: "ndo-toast--warning",
          info: "ndo-toast--info",
          loader: "ndo-toast__loader",
        },
      }}
    />
  );
}
