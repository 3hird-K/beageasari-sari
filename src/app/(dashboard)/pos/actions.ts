"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function recordSaleAction(items: { id: string; quantity: number }[]) {
  const supabase = await createClient();

  for (const item of items) {
    // First, fetch the current stock
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.id)
      .single();

    if (fetchError) {
      console.error("Failed to fetch product:", fetchError);
      continue;
    }

    const newStock = Math.max(0, product.stock_quantity - item.quantity);

    const { error: updateError } = await supabase
      .from("products")
      .update({ stock_quantity: newStock })
      .eq("id", item.id);

    if (updateError) {
      console.error("Failed to update stock:", updateError);
    }
  }

  // NOTE: If there is a sales/orders table, it should be inserted here.

  revalidatePath("/inventory");
  revalidatePath("/pos");
  return { success: true };
}
