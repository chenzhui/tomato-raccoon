"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
          Something Went Wrong
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#231f1e] mt-1">
          Temporary Interruption
        </h1>
        <p className="text-xs text-[#6b6460] mt-2">
          An unexpected error occurred while loading this page. Please try refreshing.
        </p>
      </div>
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#cf3c2a] hover:bg-[#ad2c1c] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#f5f0ea] text-[#231f1e] font-bold rounded-xl text-xs uppercase tracking-wider transition-colors border border-[#e5ded4]"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}
