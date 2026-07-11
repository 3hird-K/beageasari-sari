"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function deleteTransactionAction(orderId: string) {
  const { isAuthorized, error } = await verifyAdminRole();
  
  if (!isAuthorized) {
    return { success: false, error };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: "Server misconfiguration: missing Supabase credentials" };
  }

  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey);

  // First fetch order items to restore stock
  const { data: items, error: fetchError } = await supabaseAdmin
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", orderId);

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  // Restore stock
  if (items && items.length > 0) {
    for (const item of items) {
      const { data: product } = await supabaseAdmin
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .single();
        
      if (product) {
        await supabaseAdmin
          .from("products")
          .update({ stock_quantity: product.stock_quantity + item.quantity })
          .eq("id", item.product_id);
      }
    }
  }

  // Delete the order (cascade will delete order_items)
  const { error: deleteError } = await supabaseAdmin
    .from("orders")
    .delete()
    .eq("id", orderId);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  // Import logActivity dynamically or directly if it's imported at the top
  const { logActivity } = await import("@/lib/logger");
  await logActivity({
    action: "DELETE",
    entity_type: "ORDER",
    entity_id: orderId,
    details: `Deleted transaction (Order ID: ${orderId})`
  });

  revalidatePath("/reports");
  revalidatePath("/inventory");
  return { success: true };
}
