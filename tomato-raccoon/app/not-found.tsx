import Link from "next/link";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#cf3c2a]/10 text-[#cf3c2a] flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div>
        <span className="text-xs font-bold text-[#cf3c2a] uppercase tracking-wider">
          404 Not Found
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#231f1e] mt-1">
          Page Lost in the Fields
        </h1>
        <p className="text-xs text-[#6b6460] mt-2">
          The page or product you were looking for does not exist or has been relocated.
        </p>
      </div>
      <div className="flex justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#cf3c2a] hover:bg-[#ad2c1c] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>Go to Homepage</span>
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#f5f0ea] text-[#231f1e] font-bold rounded-xl text-xs uppercase tracking-wider transition-colors border border-[#e5ded4]"
        >
          <span>All Goods</span>
        </Link>
      </div>
    </div>
  );
}
