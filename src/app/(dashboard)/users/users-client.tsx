"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import {
  ROLE_CONFIG,
  getUserSummary,
  SystemUser,
  UserRole,
  UserStatus
} from "@/data/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { toast } from "sonner";
import { updateUserAction, deleteUserAction } from "./actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Users,
  Search,
  MoreHorizontal,
  ShieldCheck,
  UserPlus,
  Edit2,
  Trash2,
  AlertCircle
} from "lucide-react";
import { useState, useMemo, useTransition, useEffect } from "react";

export function UsersClient({ initialUsers, currentUserRole }: { initialUsers: SystemUser[], currentUserRole?: string }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // CRUD states
  const [isPending, startTransition] = useTransition();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data: users = initialUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((u) => {
        const initials = u.full_name
          ? u.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
          : "?";

        return {
          id: u.id,
          fullName: u.full_name || "Unknown User",
          email: u.email,
          role: (u.role as UserRole) || "user",
          status: "active" as UserStatus,
          avatar: u.avatar_url || initials,
          avatarGradient: "from-slate-500 to-slate-600",
          lastActive: u.updated_at || new Date().toISOString(),
          joinedAt: u.created_at || new Date().toISOString(),
        } as SystemUser;
      });
    },
    initialData: initialUsers,
  });

  useEffect(() => {
    const channel = supabase
      .channel("public:users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);

  const [editForm, setEditForm] = useState({ fullName: "", role: "user" });

  const handleEditClick = (user: SystemUser) => {
    setSelectedUser(user);
    setEditForm({ fullName: user.fullName || "", role: user.role });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: SystemUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const submitEdit = () => {
    if (!selectedUser) return;
    startTransition(async () => {
      const res = await updateUserAction(selectedUser.id, editForm.fullName, editForm.role);
      if (res.success) {
        toast.success("User updated successfully");
        setIsEditModalOpen(false);
      } else {
        toast.error(res.error || "Failed to update user");
      }
    });
  };

  const submitDelete = () => {
    if (!selectedUser) return;
    startTransition(async () => {
      const res = await deleteUserAction(selectedUser.id);
      if (res.success) {
        toast.success("User removed successfully");
        setIsDeleteModalOpen(false);
      } else {
        toast.error(res.error || "Failed to remove user");
      }
    });
  };

  const summary = useMemo(() => getUserSummary(users), [users]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, query, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((safePage - 1) * pageSize, safePage * pageSize);
  }, [filteredUsers, safePage, pageSize]);

  const metrics = [
    {
      title: "Total Users",
      value: String(summary.total),
      icon: Users,
      gradient: "from-violet-500/5",
      iconClass: "text-violet-400",
      badge: `${summary.active} Active`,
      badgeClass: "text-emerald-400 bg-emerald-400/10",
      sub: "Registered accounts",
    },
    {
      title: "System Staff",
      value: String(summary.totalStaff),
      icon: ShieldCheck,
      gradient: "from-amber-500/5",
      iconClass: "text-amber-400",
      badge: "Admin & Staff",
      badgeClass: "text-amber-400 bg-amber-400/10",
      sub: "Elevated privileges",
    },
    {
      title: "New Users",
      value: String(summary.recentSignups),
      icon: UserPlus,
      gradient: "from-sky-500/5",
      iconClass: "text-sky-400",
      badge: "Last 30 Days",
      badgeClass: "text-sky-400 bg-sky-400/10",
      sub: "Recent signups",
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6 pt-6 bg-background min-h-screen text-foreground">
      <PageHeader
        supertitle="Administration"
        title="User Management"
        subtitle="Manage accounts, roles, and access permissions for the system."
      />

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((m) => (
          <Card
            key={m.title}
            className="bg-card border-border shadow-md rounded-2xl overflow-hidden relative py-0"
          >
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br via-transparent to-transparent pointer-events-none",
                m.gradient
              )}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 pb-2 relative z-10 mb-4">
              <div className="flex items-center gap-2">
                <m.icon className={cn("h-3.5 w-3.5", m.iconClass)} />
                <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {m.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 relative z-10">
              <div className="text-2xl font-bold mb-0.5 tracking-tight">
                {m.value}
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                    m.badgeClass
                  )}
                >
                  {m.badge}
                </span>
                <p className="text-[10px] text-muted-foreground/60">{m.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-foreground">
                All Users
              </CardTitle>
              <CardDescription className="text-[11px] font-medium text-muted-foreground/60">
                Manage accounts, roles, and access permissions for the system.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search name, email..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-border bg-card pl-8 pr-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48"
                />
              </div>
              <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[130px] h-8 text-xs font-medium bg-card border-border">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest pl-6">
                    User
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                    Email
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">
                    Role
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                    Joined
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center pr-6">
                    Manage
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-12 text-center text-muted-foreground text-xs"
                    >
                      No users found matching the filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => {
                    const rc = ROLE_CONFIG[user.role] || ROLE_CONFIG.user;
                    const isOnline = false; // No longer tracking sessions
                    return (
                      <TableRow
                        key={user.id}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="size-8 border border-border">
                                {user.avatar && user.avatar.startsWith('http') ? (
                                  <AvatarImage src={user.avatar} alt={user.fullName} />
                                ) : (
                                  <AvatarFallback
                                    className={cn(
                                      "bg-gradient-to-br text-[9px] font-bold text-white",
                                      user.avatarGradient || "from-slate-500 to-slate-600"
                                    )}
                                  >
                                    {user.avatar || (user.fullName ? user.fullName.substring(0, 2).toUpperCase() : "?")}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              {isOnline && (
                                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-foreground leading-none">
                                {user.fullName || "Unnamed User"}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                {user.id.substring(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span
                              className={cn("size-1.5 rounded-full", rc.dot)}
                            />
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[9px] font-bold uppercase tracking-wider border",
                                rc.class
                              )}
                            >
                              {rc.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] font-bold uppercase tracking-wider border",
                              user.status === 'active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20'
                            )}
                          >
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {user.joinedAt ? new Date(user.joinedAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          }) : "Unknown"}
                        </TableCell>
                        <TableCell className="text-center pr-6">
                          {currentUserRole === "admin" ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 text-muted-foreground hover:text-foreground"
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-xs gap-2" onClick={() => handleEditClick(user)}>
                                  <Edit2 className="size-3.5" /> Edit details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs gap-2 text-rose-500 focus:text-rose-500" onClick={() => handleDeleteClick(user)}>
                                  <Trash2 className="size-3.5" /> Remove user
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <span className="text-xs text-muted-foreground">--</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            page={safePage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredUsers.length}
            itemLabel="users"
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription className="text-xs">
              Make changes to {selectedUser?.email}&apos;s profile here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-xs font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                className="col-span-3 text-sm h-9"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right text-xs font-medium">
                Role
              </Label>
              <div className="col-span-3">
                <Select value={editForm.role} onValueChange={(v) => setEditForm({ ...editForm, role: v })}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={submitEdit} disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-rose-500">Remove User</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to remove <strong>{selectedUser?.fullName || selectedUser?.email}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={submitDelete} disabled={isPending}>
              {isPending ? "Removing..." : "Remove User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
