import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  error?: Error;
};

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {};

  private onUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (this.state.error) return;
    const reason = event.reason;
    if (reason instanceof Error) {
      this.setState({ error: reason });
      return;
    }
    this.setState({ error: new Error(typeof reason === "string" ? reason : "Unhandled promise rejection") });
  };

  private onWindowError = (event: ErrorEvent) => {
    if (this.state.error) return;
    if (event.error instanceof Error) {
      this.setState({ error: event.error });
      return;
    }
    if (event.message) {
      this.setState({ error: new Error(event.message) });
    }
  };

  componentDidMount() {
    window.addEventListener("unhandledrejection", this.onUnhandledRejection);
    window.addEventListener("error", this.onWindowError);
  }

  componentWillUnmount() {
    window.removeEventListener("unhandledrejection", this.onUnhandledRejection);
    window.removeEventListener("error", this.onWindowError);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Keep in console for dev; UI shows a brief message.
    // eslint-disable-next-line no-console
    console.error("Unhandled UI error", error, info);
  }

  render() {
    if (this.state.error) {
      const message = import.meta.env.DEV ? this.state.error.message : "Unexpected error";
      const stack = import.meta.env.DEV ? this.state.error.stack : undefined;
      const cause = import.meta.env.DEV ? (this.state.error as any).cause : undefined;

      return (
        <div className="p-6">
          <h2 className="text-lg font-bold mb-2">
            Something went wrong
          </h2>
          <p className="mb-3">
            A client-side error prevented this page from rendering.
          </p>
          <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded text-xs overflow-x-auto">
            {message}
          </pre>

          {import.meta.env.DEV && (stack || cause) && (
            <pre className="mt-3 whitespace-pre-wrap bg-gray-100 p-3 rounded text-xs overflow-x-auto">
              {stack || ""}
              {cause ? `\nCause: ${String(cause)}` : ""}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
