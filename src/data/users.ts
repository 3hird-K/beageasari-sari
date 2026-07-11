export type UserRole = "admin" | "staff" | "user";
export type UserStatus = "active" | "inactive" | "suspended";

export interface SystemUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  avatarGradient: string;
  lastActive: string;
  joinedAt: string;
}

export const ROLE_CONFIG: Record<UserRole, { label: string; class: string; dot: string }> = {
  admin: { label: "Admin", class: "text-violet-400 bg-violet-400/10 border-violet-400/20", dot: "bg-violet-400" },
  staff: { label: "Staff", class: "text-amber-400 bg-amber-400/10 border-amber-400/20", dot: "bg-amber-400" },
  user:  { label: "User",  class: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400" },
};

export const STATUS_CONFIG: Record<UserStatus, { label: string; class: string; dot: string }> = {
  active:    { label: "Active",    class: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400" },
  inactive:  { label: "Inactive",  class: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",         dot: "bg-zinc-400" },
  suspended: { label: "Suspended", class: "text-rose-400 bg-rose-400/10 border-rose-400/20",         dot: "bg-rose-400" },
};

export const USERS: SystemUser[] = [
  { id: "USR-001", fullName: "Koji Kiyotaka", email: "koji.kiyotaka@smartgrow.io", role: "admin", status: "active", avatar: "KK", avatarGradient: "from-violet-500 to-purple-600", lastActive: "2026-06-27T09:12:00+08:00", joinedAt: "2025-11-10T08:00:00+08:00" },
  { id: "USR-002", fullName: "Maria Santos", email: "maria.santos@smartgrow.io", role: "staff", status: "active", avatar: "MS", avatarGradient: "from-emerald-500 to-teal-600", lastActive: "2026-06-27T08:45:00+08:00", joinedAt: "2026-01-15T08:00:00+08:00" },
  { id: "USR-003", fullName: "Carlos Reyes", email: "carlos.reyes@smartgrow.io", role: "user", status: "active", avatar: "CR", avatarGradient: "from-amber-500 to-orange-600", lastActive: "2026-06-27T07:30:00+08:00", joinedAt: "2026-02-20T08:00:00+08:00" },
  { id: "USR-004", fullName: "Angela Cruz", email: "angela.cruz@smartgrow.io", role: "staff", status: "active", avatar: "AC", avatarGradient: "from-sky-500 to-cyan-600", lastActive: "2026-06-26T16:20:00+08:00", joinedAt: "2026-03-05T08:00:00+08:00" },
  { id: "USR-005", fullName: "James Villanueva", email: "james.v@smartgrow.io", role: "user", status: "active", avatar: "JV", avatarGradient: "from-sky-400 to-blue-500", lastActive: "2026-06-26T14:10:00+08:00", joinedAt: "2026-04-12T08:00:00+08:00" },
  { id: "USR-006", fullName: "Rina Dela Peña", email: "rina.dp@smartgrow.io", role: "user", status: "inactive", avatar: "RD", avatarGradient: "from-rose-500 to-pink-600", lastActive: "2026-06-20T11:00:00+08:00", joinedAt: "2026-01-28T08:00:00+08:00" },
  { id: "USR-007", fullName: "Paolo Garcia", email: "paolo.garcia@smartgrow.io", role: "user", status: "active", avatar: "PG", avatarGradient: "from-teal-400 to-emerald-500", lastActive: "2026-06-27T09:01:00+08:00", joinedAt: "2026-05-01T08:00:00+08:00" },
  { id: "USR-008", fullName: "Sofia Lim", email: "sofia.lim@smartgrow.io", role: "staff", status: "suspended", avatar: "SL", avatarGradient: "from-zinc-500 to-gray-600", lastActive: "2026-06-10T09:30:00+08:00", joinedAt: "2025-12-01T08:00:00+08:00" },
];

export function getUserSummary(users: SystemUser[]) {
  const total = users.length;
  const active = users.filter((u) => u.status === "active").length;
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const recentSignups = users.filter((u) => {
    if (!u.joinedAt) return false;
    return new Date(u.joinedAt) >= thirtyDaysAgo;
  }).length;

  const totalStaff = users.filter((u) => u.role === "staff" || u.role === "admin").length;

  return { total, active, recentSignups, totalStaff };
}
