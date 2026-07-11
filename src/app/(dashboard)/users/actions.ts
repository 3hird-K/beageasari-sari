"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/logger";

async function verifyAdminRole() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { isAuthorized: false, error: "Unauthorized", supabase: null };
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userError || userData?.role !== "admin") {
    return { isAuthorized: false, error: "Only admins can perform this action.", supabase: null };
  }

  return { isAuthorized: true, error: null, supabase };
}

export async function updateUserAction(id: string, fullName: string, role: string) {
  const { isAuthorized, error } = await verifyAdminRole();
  
  if (!isAuthorized) {
    return { success: false, error };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: "Supabase Service Role Key is not configured." };
  }

  const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error: updateError } = await supabaseAdmin
    .from("users")
    .update({ full_name: fullName, role, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  await logActivity({
    action: "UPDATE",
    entity_type: "USER",
    entity_id: id,
    details: `Updated user ${fullName}'s role to ${role}`
  });

  revalidatePath("/users");
  return { success: true };
}

export async function deleteUserAction(id: string) {
  const { isAuthorized, error: authError } = await verifyAdminRole();
  
  if (!isAuthorized) {
    return { success: false, error: authError };
  }

  // Use the service role key to completely remove the user from Supabase Auth
  // This will automatically cascade to the public.users table due to our foreign key constraints
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: "Supabase Service Role Key is not configured." };
  }

  const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logActivity({
    action: "DELETE",
    entity_type: "USER",
    entity_id: id,
    details: `Deleted user with ID ${id}`
  });

  revalidatePath("/users");
  return { success: true };
}
