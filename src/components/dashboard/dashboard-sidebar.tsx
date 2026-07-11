"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Store,
  MoreVertical,
  UserCircle,
  Plus,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type NavItem = {
  label: string;
  icon: typeof LayoutDashboard;
  href: string | null;
  section?: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Point of Sale", icon: ShoppingCart, href: "/pos", section: "Operations" },
  { label: "Inventory", icon: Package, href: "/inventory" },
  { label: "Sales Reports", icon: BarChart2, href: "/reports", section: "Analytics" },
  { label: "Users", icon: Users, href: "/users", section: "Administration" },
  { label: "Audit Logs", icon: FileText, href: "/logs" },
];

export function SidebarContent({ collapsed = false, onItemClick, user, profile }: { collapsed?: boolean; onItemClick?: () => void; user?: User; profile?: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const fullName = `${firstName} ${lastName}`.trim();
    
    const supabase = createClient();
    if (user?.id) {
      const { error } = await supabase.from('users').update({ full_name: fullName }).eq('id', user.id);
      if (!error) {
        setIsDialogOpen(false);
        router.refresh();
      } else {
        console.error("Failed to update profile", error);
      }
    }
    setIsSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploading(true);
    const supabase = createClient();
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      router.refresh();
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const roleName = profile?.role || "staff";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex h-full flex-col">
      {/* ── Brand ── */}
      <Link
        href="/"
        className={cn(
          "flex shrink-0 items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer",
          collapsed ? "flex-col items-center px-0" : "px-2",
          "h-16"
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden transition-all duration-200",
            collapsed ? "size-8" : "size-10"
          )}
          aria-hidden
        >
          {mounted && (
            <div className={cn(
              "flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20",
              collapsed ? "size-8" : "size-10"
            )}>
              <Store className={collapsed ? "size-4" : "size-5"} />
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-extrabold tracking-tight text-foreground leading-none">
              BEAGEA
            </p>
            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-widest text-primary">
              POS & Inventory
            </p>
          </div>
        )}
      </Link>

      {/* ── Nav section ── */}
      <div
        className={cn(
          "mt-8 min-h-0 flex-1 overflow-y-auto overflow-x-hidden",
          collapsed ? "px-0" : "px-1",
        )}
      >
        {!collapsed && (
          <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Store Management
          </p>
        )}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active =
              item.href != null &&
              (item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`));

            const sectionLabel =
              !collapsed && item.section ? (
                <p className="mt-5 mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {item.section}
                </p>
              ) : (
                collapsed && item.section ? <div className="my-2 h-px w-full bg-border/50" /> : null
              );

            const content = (
              <>
                <item.icon
                  className={cn(
                    "size-4 shrink-0",
                    active ? "text-white" : "text-muted-foreground",
                  )}
                  strokeWidth={2}
                />
                {!collapsed && (
                  <span className="truncate text-[12px] font-semibold">
                    {item.label}
                  </span>
                )}
              </>
            );
            const itemClass = cn(
              "group flex items-center rounded-lg text-left transition-colors duration-150",
              collapsed ? "justify-center px-0 py-2" : "gap-3 px-3 py-2",
              active
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            );

            const navElement =
              item.href == null ? (
                <span
                  key={item.label}
                  className={itemClass}
                  title={collapsed ? item.label : undefined}
                >
                  {content}
                </span>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={itemClass}
                  title={collapsed ? item.label : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={onItemClick}
                >
                  {content}
                </Link>
              );

            return (
              <div key={item.label}>
                {sectionLabel}
                {navElement}
              </div>
            );
          })}
        </nav>
      </div>

      {/* ── Bottom actions ── */}
      <div className="mt-auto shrink-0 space-y-2 px-1 pt-4 border-t border-sidebar-border">
        <div className={cn("flex flex-col gap-0.5", collapsed ? "px-0" : "")}>
          <Link
            href="/settings"
            className={cn(
              "flex items-center rounded-lg text-[12px] font-semibold transition-colors duration-150",
              collapsed ? "justify-center px-0 py-2" : "gap-3 px-3 py-2",
              pathname === "/settings"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
            title={collapsed ? "Settings" : undefined}
            onClick={onItemClick}
          >
            <Settings
              className={cn("size-4", pathname === "/settings" ? "text-white" : "text-muted-foreground")}
              strokeWidth={2}
            />
            {!collapsed && <span>Settings</span>}
          </Link>
          <Link
            href="/get-help"
            className={cn(
              "flex items-center rounded-lg text-[12px] font-semibold transition-colors duration-150",
              collapsed ? "justify-center px-0 py-2" : "gap-3 px-3 py-2",
              pathname === "/get-help"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
            title={collapsed ? "Get Help" : undefined}
            onClick={onItemClick}
          >
            <HelpCircle
              className={cn("size-4", pathname === "/get-help" ? "text-white" : "text-muted-foreground")}
              strokeWidth={2}
            />
            {!collapsed && <span>Get Help</span>}
          </Link>
        </div>

        {/* ── User card ── */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                role="button"
                className={cn(
                  "flex items-center rounded-lg bg-muted/50 p-2.5 transition-colors hover:bg-muted cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                  collapsed ? "flex-col gap-2" : "gap-3",
                )}
              >
                <div className="relative">
                  <Avatar className="size-8 shrink-0 border border-border">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-[9px] font-bold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-sidebar bg-emerald-500" />
                </div>
                {!collapsed && (
                  <>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-[12px] font-extrabold text-foreground uppercase tracking-widest leading-tight">
                        {displayName}
                      </p>
                      <p className="truncate text-[10px] text-primary uppercase font-bold tracking-widest mt-0.5">
                        {roleName}
                      </p>
                    </div>
                    <MoreVertical className="size-4 shrink-0 text-muted-foreground" />
                  </>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[260px] rounded-xl bg-popover border-border shadow-md p-1.5" align="center" side="right" sideOffset={16}>
              <DropdownMenuLabel className="flex items-center gap-3 p-2">
                <Avatar className="size-10 border border-border shrink-0">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold truncate text-foreground">{displayName}</span>
                  <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuGroup className="p-1">
                <DropdownMenuItem 
                  className="cursor-pointer gap-3 text-primary focus:text-primary focus:bg-primary/10 py-2.5 px-3 rounded-md transition-colors"
                  onSelect={(e) => { e.preventDefault(); setIsDialogOpen(true); }}
                >
                  <UserCircle className="size-4 shrink-0" />
                  <span className="font-medium">Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer gap-3 text-destructive focus:text-destructive focus:bg-destructive/10 py-2.5 px-3 rounded-md transition-colors mt-0.5"
                  onSelect={handleSignOut}
                >
                  <LogOut className="size-4 shrink-0" />
                  <span className="font-medium">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-[400px] bg-popover border-border p-0 gap-0 shadow-lg rounded-xl overflow-hidden">
            <form onSubmit={handleUpdateProfile}>
              <DialogHeader className="p-6 pb-4 gap-1.5 text-left border-b border-border">
                <DialogTitle className="text-lg font-semibold text-foreground">Edit Profile</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Update your personal information and profile picture.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center p-6 pt-4 gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className={cn(
                      "relative group cursor-pointer hover:opacity-90 transition-opacity",
                      isUploading ? "pointer-events-none opacity-50" : ""
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Avatar className="size-20 border border-border">
                      {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-primary-foreground shadow-sm ring-2 ring-background">
                      <Plus className="size-3.5" strokeWidth={3} />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {isUploading ? "Uploading..." : "Click photo to change"}
                  </p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleAvatarUpload} 
                  />
                </div>
                
                <div className="grid w-full gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName" className="text-xs font-semibold text-foreground">First Name</Label>
                    <Input 
                      id="firstName"
                      name="firstName"
                      defaultValue={displayName.split(' ')[0] || ''} 
                      className="bg-background border-input focus-visible:ring-primary focus-visible:border-primary h-10 px-3 text-sm rounded-md transition-all" 
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName" className="text-xs font-semibold text-foreground">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      defaultValue={displayName.split(' ').slice(1).join(' ') || ''} 
                      className="bg-background border-input focus-visible:ring-primary focus-visible:border-primary h-10 px-3 text-sm rounded-md transition-all" 
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="p-6 pt-0 sm:justify-end">
                <Button type="submit" disabled={isSaving} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 rounded-md transition-all">
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export function DashboardSidebar({ collapsed, user, profile }: { collapsed: boolean; user: User; profile: any }) {
  return (
    <aside
      className={cn(
        "hidden lg:flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar py-6 transition-[width,padding] duration-200 ease-out",
        collapsed ? "w-[60px] px-1.5" : "w-[16%] min-w-[250px] px-5",
      )}
    >
      <SidebarContent collapsed={collapsed} user={user} profile={profile} />
    </aside>
  );
}
