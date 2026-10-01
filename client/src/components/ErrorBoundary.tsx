import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="grid min-h-screen place-items-center bg-[#06080a] p-8 text-[#f3f0e9]">
        <div className="flex w-full max-w-xl flex-col items-center text-center">
          <AlertTriangle size={44} className="mb-6 text-[#ffb547]" />
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">Something glitched.</h2>
          <p className="mt-3 text-white/60">The page hit an unexpected error. Reloading usually fixes it.</p>
          {import.meta.env.DEV && (
            <pre className="mt-6 max-h-60 w-full overflow-auto rounded-xl bg-white/5 p-4 text-left text-xs text-white/60 whitespace-break-spaces">{this.state.error?.stack}</pre>
          )}
          <button onClick={() => window.location.reload()} className="btn btn-lime mt-8"><RotateCcw size={15} /> Reload page</button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
