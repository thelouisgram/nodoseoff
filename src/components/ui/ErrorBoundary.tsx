import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { SoftButton, SoftCard } from "@/components/ui/soft";

type FallbackRender = (args: {
  error: Error | null;
  reset: () => void;
}) => ReactNode;

interface Props {
  children: ReactNode;
  fallback?: FallbackRender;
  onReset?: () => void;
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.label ? `:${this.props.label}` : ""}]`, error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) {
      return this.props.fallback({
        error: this.state.error,
        reset: this.reset,
      });
    }

    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6 font-jakarta">
        <SoftCard className="max-w-md p-8 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-soft-muted">
            Something went wrong
          </p>
          <h2 className="mt-2 text-[22px] font-bold tracking-tight text-soft-ink">
            This section crashed
          </h2>
          <p className="mt-2 text-[14px] text-soft-muted">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <SoftButton type="button" className="mt-6 w-full" onClick={this.reset}>
            Try again
          </SoftButton>
        </SoftCard>
      </div>
    );
  }
}
