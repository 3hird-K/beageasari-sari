const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lmdoriinyskftiffyrih.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZG9yaWlueXNrZnRpZmZ5cmloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzY2ODI2MSwiZXhwIjoyMDk5MjQ0MjYxfQ.854lOPpxAlZAK-nLqFry02MWzrubf4DYkuGEL2VO7p4' // service_role key
);

async function test() {
  const { data, error } = await supabase.from('orders').select('*, users(full_name)');
  console.log('Error:', error);
  if (data?.length > 0) {
    console.log('First order:', data[0]);
  }
}

test();
