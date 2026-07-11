"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Store, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[18px] mr-2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const CheckCircle = () => (
  <div className="shrink-0 flex items-center justify-center size-5 rounded-full bg-[#2EBA63]">
    <Check className="size-3 text-[#0B2F1F]" strokeWidth={3} />
  </div>
);

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="w-full max-w-[850px] h-auto min-h-[500px] bg-white rounded-[24px] overflow-hidden shadow-2xl flex flex-col md:flex-row">
      {/* Left Column (Dark Green) */}
      <div className="md:w-[48%] bg-[#0B2516] text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] bg-[#2EBA63]/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div>
          <div className="inline-flex items-center space-x-1.5 mb-10">
            <Store className="size-5 text-[#2EBA63] transform -rotate-3" />
            <span className="font-bold tracking-tight text-white/90 text-lg">Beagea Sari-Sari</span>
          </div>

          <h1 className="text-xl md:text-[2rem] leading-[1.1] font-bold tracking-tight mb-6 md:mb-10">
            Where local business<br className="hidden md:block" />
            <span className="md:hidden"> meets smart, modern inventory.</span>
            <span className="hidden md:inline">meets smart,<br />modern inventory.</span>
          </h1>

          <div className="hidden md:block space-y-5">
            <div className="flex gap-3">
              <CheckCircle />
              <div>
                <h3 className="font-bold text-[13px] mb-0.5">Track your sales</h3>
                <p className="text-[12px] text-white/70 leading-snug">
                  Easily record transactions and monitor daily revenue in real-time.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle />
              <div>
                <h3 className="font-bold text-[13px] mb-0.5">Manage inventory</h3>
                <p className="text-[12px] text-white/70 leading-snug">
                  Stay on top of stock levels and never run out of your best-selling items.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle />
              <div>
                <h3 className="font-bold text-[13px] mb-0.5">Grow your business</h3>
                <p className="text-[12px] text-white/70 leading-snug">
                  Use insightful reports to make data-driven decisions and boost profits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (White) */}
      <div className="md:w-[52%] bg-white p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-[320px] mx-auto w-full">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-[13px] text-gray-500 mb-8 leading-relaxed">
            <span className="hidden md:inline">Sign in with Google to access your dashboard, track sales, and manage inventory.</span>
            <span className="md:hidden">Sign in to access your dashboard.</span>
          </p>

          <div className="mb-8">
            <Button
              variant="outline"
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full h-10 rounded-lg border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-semibold shadow-sm transition-all text-[13px]"
            >
              {isLoading ? (
                <Loader2 className="size-[18px] mr-2 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </Button>
          </div>

          <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
            By continuing you agree to our <Link href="#" className="text-[#2EBA63] font-medium hover:underline">Terms</Link> and <Link href="#" className="text-[#2EBA63] font-medium hover:underline">Privacy Policy</Link>.
          </p>

          <p className="text-[11px] text-gray-500 leading-relaxed">
            New here? Continuing with Google creates your account automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
