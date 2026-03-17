"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={`flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/30 p-8 text-center dark:border-red-900/20 dark:bg-red-900/5 ${this.props.className}`}>
          <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
          <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
            Component Error
          </h3>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            This section failed to load properly.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-lg border-red-200 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={() => this.setState({ hasError: false })}
          >
            <RefreshCcw className="mr-1.5 h-3 w-3" />
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
