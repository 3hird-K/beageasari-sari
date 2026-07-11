import { createClient } from "@/lib/supabase/server";
import { UsersClient } from "./users-client";
import { SystemUser, UserRole, UserStatus } from "@/data/users";

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  let currentUserRole = "user";
  
  if (user) {
    const { data: currentUserData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if (currentUserData) {
      currentUserRole = currentUserData.role;
    }
  }

  // Fetch users from the public.users table
  const { data: usersData, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
  }

  // Map database users to the SystemUser interface
  const mappedUsers: SystemUser[] = (usersData || []).map((u) => {
    // Generate initials for fallback avatar if avatar_url is missing
    const initials = u.full_name
      ? u.full_name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "?";

    return {
      id: u.id,
      fullName: u.full_name || "Unknown User",
      email: u.email,
      role: (u.role as UserRole) || "user",
      status: "active" as UserStatus, // Placeholder, you could add this to DB later
      avatar: u.avatar_url || initials,
      avatarGradient: "from-slate-500 to-slate-600", // Default gradient
      lastActive: u.updated_at || new Date().toISOString(),
      joinedAt: u.created_at || new Date().toISOString(),
    };
  });

  return <UsersClient initialUsers={mappedUsers} currentUserRole={currentUserRole} />;
}
