-- Add cashier_id to orders table to track who recorded the sale
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS cashier_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- Optional: Create an index for faster querying by cashier
CREATE INDEX IF NOT EXISTS idx_orders_cashier_id ON public.orders(cashier_id);
