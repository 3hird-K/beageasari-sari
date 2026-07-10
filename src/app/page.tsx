"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, ShoppingCart, Package, TrendingUp, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Store className="size-4" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight leading-none">BEAGEA</p>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-primary">Sari-Sari POS</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link href="/sign-up">
              <Button className="h-9 px-4 font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden flex flex-col items-center justify-center text-center px-4">
          {/* Background Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] opacity-50 pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Beagea v2.0 is now live
          </div>
          
          <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            The modern POS built for <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">Sari-Sari Stores.</span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 font-medium animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Empower your local business with intelligent inventory tracking, seamless checkout experiences, and real-time sales reports. Fast, beautiful, and completely tailored for you.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Link href="/sign-up">
              <Button className="h-12 px-8 font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 rounded-full transition-all hover:scale-105 active:scale-95 group">
                Start for free
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/pos">
              <Button variant="outline" className="h-12 px-8 font-bold text-sm rounded-full border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent transition-all">
                View Demo
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="w-full max-w-6xl mx-auto py-24 px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to run your store</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Replace the old notebook with a powerful digital system. Beagea simplifies operations so you can focus on growing your business.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-8 transition-all hover:bg-card/60 hover:shadow-2xl hover:shadow-primary/5">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingCart className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast Checkout</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Process transactions in seconds with our optimized POS interface. Supports barcode scanning and quick-tap popular items.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-8 transition-all hover:bg-card/60 hover:shadow-2xl hover:shadow-orange-500/5">
              <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="size-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Inventory</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Never run out of stock unexpectedly. Get automatic low-stock alerts and easily track product categories and variants.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-8 transition-all hover:bg-card/60 hover:shadow-2xl hover:shadow-emerald-500/5">
              <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="size-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Understand your business health. Generate daily sales reports, track profit margins, and identify your best-selling items effortlessly.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full border-t border-border/50 bg-accent/20 py-24">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built for security and reliability</h2>
              <p className="text-lg text-muted-foreground">
                Your store data is precious. We ensure it&apos;s always backed up, secure, and accessible exactly when you need it.
              </p>
              <ul className="space-y-4">
                {[
                  "Cloud-synced data prevents loss",
                  "Secure Manager and Cashier roles",
                  "Works smoothly even on slow networks",
                  "Hardware integration for printers & scanners"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                    <span className="font-medium text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link href="/sign-up">
                  <Button className="font-bold">Create your store</Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-teal-400 rounded-3xl blur opacity-20" />
              <div className="relative rounded-3xl border border-border/50 bg-card p-6 shadow-2xl flex flex-col gap-4">
                {/* Mock UI Element */}
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <div>
                    <h4 className="font-bold">Today&apos;s Sales</h4>
                    <p className="text-xs text-muted-foreground">Updated just now</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-xl font-bold text-emerald-500">₱ 4,250.00</h4>
                    <p className="text-xs text-emerald-500/70">+12% vs yesterday</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-2">
                  <div className="size-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <ShieldCheck className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[75%]" />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground">
                      <span>System Status</span>
                      <span className="text-primary">100% Secure</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/50 bg-background py-8 text-center">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <Store className="size-4" />
            <span className="font-bold text-sm tracking-tight">Beagea Sari-Sari POS</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Beagea POS System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
