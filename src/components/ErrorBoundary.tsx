import { Component } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <svg viewBox="0 0 80 40" className="h-12 mx-auto opacity-60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="20" rx="38" ry="18" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M28 20 Q40 8 52 20 Q40 32 28 20" stroke="currentColor" strokeWidth="0.8" fill="none" />
              </svg>
            </div>
            <p className="text-xs tracking-[0.4em] uppercase text-teal mb-4">
              Something slipped
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 leading-tight">
              A thread came loose.
            </h1>
            <p className="text-ink-soft font-light leading-relaxed mb-10">
              We encountered an unexpected error. Our team has been quietly notified.
              You can try again, or return to the house.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 bg-teal-deep text-jasmine px-6 py-3 text-[0.7rem] tracking-[0.32em] uppercase rounded-full hover:bg-teal transition-colors"
              >
                Try again
              </button>
              <Link
                to="/"
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 border border-border px-6 py-3 text-[0.7rem] tracking-[0.32em] uppercase rounded-full text-ink hover:border-ink-soft/50 transition-colors"
              >
                Return home
              </Link>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="text-xs text-ink-soft/50 cursor-pointer tracking-wide">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-sakura bg-jasmine-deep p-4 rounded overflow-auto max-h-48">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
