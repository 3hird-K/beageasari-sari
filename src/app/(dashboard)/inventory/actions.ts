"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addProductAction(data: { name: string; category: string; sku: string; price: number; stock_quantity: number; color?: string }) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").insert([data]);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  revalidatePath("/inventory");
  revalidatePath("/pos");
  return { success: true };
}

export async function updateProductAction(id: string, data: { name?: string; category?: string; sku?: string; price?: number; stock_quantity?: number; color?: string }) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update(data).eq("id", id);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  revalidatePath("/inventory");
  revalidatePath("/pos");
  return { success: true };
}

export async function deleteProductAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  revalidatePath("/inventory");
  revalidatePath("/pos");
  return { success: true };
}
