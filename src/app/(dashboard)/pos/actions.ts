"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function recordSaleAction(items: { id: string; quantity: number }[]) {
  const supabase = await createClient();

  let totalAmount = 0;
  const orderItemsData = [];

  for (const item of items) {
    // First, fetch the current stock and price
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("stock_quantity, price")
      .eq("id", item.id)
      .single();

    if (fetchError || !product) {
      console.error("Failed to fetch product:", fetchError);
      continue;
    }

    const newStock = Math.max(0, product.stock_quantity - item.quantity);
    const subtotal = item.quantity * product.price;
    totalAmount += subtotal;

    orderItemsData.push({
      product_id: item.id,
      quantity: item.quantity,
      unit_price: product.price,
      subtotal: subtotal,
    });

    const { error: updateError } = await supabase
      .from("products")
      .update({ stock_quantity: newStock })
      .eq("id", item.id);

    if (updateError) {
      console.error("Failed to update stock:", updateError);
    }
  }

  if (orderItemsData.length > 0) {
    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{ total_amount: totalAmount }])
      .select("id")
      .single();

    if (orderError || !order) {
       console.error("Failed to create order:", orderError);
       return { success: false, error: "Failed to create order" };
    }

    // Insert order items
    const itemsToInsert = orderItemsData.map(oi => ({
      ...oi,
      order_id: order.id
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsToInsert);

    if (itemsError) {
       console.error("Failed to insert order items:", itemsError);
    }
  }

  revalidatePath("/inventory");
  revalidatePath("/pos");
  revalidatePath("/reports");
  return { success: true };
}
