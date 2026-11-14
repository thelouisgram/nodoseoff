import type { ReactElement, ReactNode } from "react";
import { toast as sonnerToast, type ExternalToast } from "sonner";

type Message = string | ReactNode;
type Id = string | number;
type PromiseArgs = Parameters<typeof sonnerToast.promise>;

const base: ExternalToast = {
  duration: 3800,
};

const errorDefaults: ExternalToast = {
  duration: 5200,
};

/**
 * App-owned notifications. Prefer this over importing `sonner` directly
 * so duration and toaster theming stay consistent.
 */
function notify(message: Message, data?: ExternalToast): Id {
  return sonnerToast(message, { ...base, ...data });
}

notify.success = (message: Message, data?: ExternalToast): Id =>
  sonnerToast.success(message, { ...base, ...data });

notify.error = (message: Message, data?: ExternalToast): Id =>
  sonnerToast.error(message, { ...errorDefaults, ...data });

notify.warning = (message: Message, data?: ExternalToast): Id =>
  sonnerToast.warning(message, { ...base, ...data });

notify.info = (message: Message, data?: ExternalToast): Id =>
  sonnerToast.info(message, { ...base, ...data });

notify.message = (message: Message, data?: ExternalToast): Id =>
  sonnerToast.message(message, { ...base, ...data });

notify.loading = (message: Message, data?: ExternalToast): Id =>
  sonnerToast.loading(message, { duration: Infinity, ...data });

notify.promise = (
  promise: PromiseArgs[0],
  data?: PromiseArgs[1],
): Id => sonnerToast.promise(promise, data);

notify.custom = (
  jsx: (id: Id) => ReactElement,
  data?: ExternalToast,
): Id => sonnerToast.custom(jsx, { ...base, ...data });

notify.dismiss = (id?: Id) => sonnerToast.dismiss(id);

/** Drop-in alias so call sites can keep `toast.success(...)`. */
export const toast = notify;

export { notify };
export type { ExternalToast };
