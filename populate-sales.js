require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateData() {
  console.log('Populating sales data...');

  // 1. Fetch available products
  const { data: products, error: productsError } = await supabase.from('products').select('id, price, stock_quantity');
  if (productsError || !products || products.length === 0) {
    console.error('Failed to fetch products. Make sure you have products in your inventory.', productsError);
    return;
  }

  // 2. Fetch an admin or staff user for cashier_id
  const { data: users, error: usersError } = await supabase.from('users').select('id').in('role', ['admin', 'staff']).limit(1);
  const cashierId = users && users.length > 0 ? users[0].id : null;

  if (!cashierId) {
    console.log('Warning: No admin or staff user found. Cashier ID will be null.');
  }

  const today = new Date();
  
  // Generate around 15-25 random orders spread across the last 7 days
  const numOrders = Math.floor(Math.random() * 10) + 15;
  let totalOrdersInserted = 0;

  for (let i = 0; i < numOrders; i++) {
    // Pick a random day in the last 7 days
    const daysAgo = Math.floor(Math.random() * 7);
    const orderDate = new Date(today);
    orderDate.setDate(orderDate.getDate() - daysAgo);
    
    // Add random hours and minutes
    orderDate.setHours(Math.floor(Math.random() * 12) + 8); // 8 AM to 8 PM
    orderDate.setMinutes(Math.floor(Math.random() * 60));

    // Create 1 to 4 random order items
    const numItems = Math.floor(Math.random() * 4) + 1;
    let totalAmount = 0;
    const orderItems = [];

    // Select random products for this order
    const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffledProducts.slice(0, numItems);

    for (const product of selectedProducts) {
      const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
      const subtotal = product.price * quantity;
      totalAmount += subtotal;

      orderItems.push({
        product_id: product.id,
        quantity,
        unit_price: product.price,
        subtotal
      });
    }

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        total_amount: totalAmount,
        status: 'completed',
        created_at: orderDate.toISOString(),
        cashier_id: cashierId
      }])
      .select('id')
      .single();

    if (orderError) {
      // If the column cashier_id doesn't exist, we fallback to not including it
      if (orderError.message.includes('cashier_id')) {
        console.log('It seems the cashier_id column does not exist yet. Please run the SQL file provided earlier.');
        return;
      }
      console.error('Error creating order:', orderError);
      continue;
    }

    // Insert order items
    const itemsToInsert = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error inserting order items:', itemsError);
    } else {
      totalOrdersInserted++;
    }
  }

  console.log(`Successfully populated ${totalOrdersInserted} dummy orders!`);
}

populateData();
