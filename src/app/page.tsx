"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, ShoppingCart, Coffee, Package, MapPin, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/pos" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Store className="size-4" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight leading-none">BEAGEA</p>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-primary">Sari-Sari Store</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="outline" className="h-9 px-4 font-bold text-xs border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent transition-all">
                Staff Login
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
            Open Daily • 6 AM to 10 PM
          </div>
          
          <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Welcome to <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">Beagea Sari-Sari Store!</span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 font-medium animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Your friendly neighborhood stop for daily essentials, cold drinks, snacks, and everything you need in a pinch. Convenient, affordable, and always welcoming.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Link href="#offerings">
              <Button className="h-12 px-8 font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 rounded-full transition-all hover:scale-105 active:scale-95 group">
                See What We Offer
                <ShoppingCart className="ml-2 size-4 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Offerings Grid */}
        <section id="offerings" className="w-full max-w-6xl mx-auto py-24 px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Stocked with all your favorites</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From early morning coffee to late-night snacks, Beagea Sari-Sari Store has you covered. Drop by and get what you need.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-8 transition-all hover:bg-card/60 hover:shadow-2xl hover:shadow-primary/5">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Coffee className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Drinks & Refreshments</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ice-cold sodas, bottled water, energy drinks, and coffee sachets. Perfect to beat the heat or kickstart your day.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-8 transition-all hover:bg-card/60 hover:shadow-2xl hover:shadow-orange-500/5">
              <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="size-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pantry Essentials</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Canned goods, noodles, rice, cooking oil, and condiments. Everything you need to complete your home-cooked meals.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-8 transition-all hover:bg-card/60 hover:shadow-2xl hover:shadow-emerald-500/5">
              <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingCart className="size-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Snacks & Sweets</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A wide variety of chips, biscuits, candies, and chocolates. Grab a quick bite for your merienda break.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action for Customers and Staff */}
        <section className="w-full border-t border-border/50 bg-accent/20 py-24">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Visit us today!</h2>
              <p className="text-lg text-muted-foreground">
                We are proud to serve the community with a smile. Support your local sari-sari store and enjoy the convenience of quick, friendly service right in your neighborhood.
              </p>
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-emerald-500 shrink-0" />
                <span className="font-medium text-sm">Located at the heart of the community.</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-teal-400 rounded-3xl blur opacity-20" />
              <div className="relative rounded-3xl border border-border/50 bg-card p-8 shadow-2xl flex flex-col gap-6 text-center">
                <h3 className="text-2xl font-bold">Staff Access</h3>
                <p className="text-sm text-muted-foreground">
                  Are you a cashier or store manager? Log in here to access the Beagea POS, manage inventory, and record sales.
                </p>
                <div className="pt-2">
                  <Link href="/sign-in">
                    <Button className="w-full h-12 font-bold group">
                      Open POS Terminal
                      <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
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
            <span className="font-bold text-sm tracking-tight">Beagea Sari-Sari Store</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Beagea Sari-Sari Store. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Developed by <a href="https://github.com/3hird-K" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary transition-colors hover:underline">3hird-K</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
