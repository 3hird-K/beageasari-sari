const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lmdoriinyskftiffyrih.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZG9yaWlueXNrZnRpZmZ5cmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjgyNjEsImV4cCI6MjA5OTI0NDI2MX0.Kz1CoNqn-jCz27u5l0en3sycRRYtYyk1kMY_53MEheE'
);

async function test() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      total_amount,
      status,
      cashier_id,
      users ( full_name ),
      order_items ( quantity )
    `);

  console.log('Error:', error);
  console.log('Data count:', data?.length);
  console.log('First order:', JSON.stringify(data?.[0], null, 2));
}

test();
