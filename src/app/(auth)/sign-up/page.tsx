"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="flex justify-center mb-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Store className="size-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-xs font-medium text-muted-foreground">
          Register to manage your Beagea Sari Sari Store POS.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
          <Input id="name" placeholder="Juan Dela Cruz" className="h-11 bg-background/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
          <Input id="email" type="email" placeholder="juan@example.com" className="h-11 bg-background/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" className="h-11 bg-background/50" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-2">
        <Link href="/pos" className="w-full">
          <Button className="w-full h-11 font-bold">Sign Up</Button>
        </Link>
        <div className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
