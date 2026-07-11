import { createClient } from "./supabase/server";

export async function logActivity({
  action,
  entity_type,
  entity_id,
  details
}: {
  action: string;
  entity_type: string;
  entity_id?: string;
  details: string;
}) {
  try {
    const supabase = await createClient();
    
    // Attempt to get the current user ID
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("audit_logs").insert({
      user_id: user?.id || null,
      action,
      entity_type,
      entity_id,
      details
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
