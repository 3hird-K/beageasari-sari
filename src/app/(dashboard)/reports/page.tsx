import { createClient } from "@/lib/supabase/server";
import { ReportsClient } from "./reports-client";

export default async function ReportsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  if (user) {
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single();
    isAdmin = userData?.role === "admin";
  }

  return <ReportsClient isAdmin={isAdmin} />;
}

