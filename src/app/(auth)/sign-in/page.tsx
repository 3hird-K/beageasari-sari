"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="flex justify-center mb-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Store className="size-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
        <CardDescription className="text-xs font-medium text-muted-foreground">
          Sign in to access your Beagea POS dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
          <Input id="email" type="email" placeholder="juan@example.com" className="h-11 bg-background/50" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
            <Link href="#" className="text-[11px] font-bold text-primary hover:underline">Forgot password?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" className="h-11 bg-background/50" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-2">
        <Link href="/pos" className="w-full">
          <Button className="w-full h-11 font-bold">Sign In</Button>
        </Link>
        <div className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary font-bold hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
