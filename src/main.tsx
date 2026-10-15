import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="text-5xl mb-4">🐝</div>
            <h1 className="text-2xl font-bold text-amber-400 font-fredoka mb-2">Ups, Terjadi Kendala!</h1>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Permainan mengalami kendala saat memuat data. Anda dapat memuat ulang halaman atau mengatur ulang data lokal.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition cursor-pointer shadow-lg"
              >
                🔄 Muat Ulang Halaman
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                ⚙️ Bersihkan Data & Mulai Baru
              </button>
            </div>
            {this.state.error && (
              <p className="mt-4 text-xs text-slate-500 font-mono text-left bg-slate-950 p-2 rounded overflow-x-auto">
                {this.state.error.message}
              </p>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
