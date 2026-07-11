CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- e.g., 'CREATE', 'UPDATE', 'DELETE', 'SALE'
  entity_type TEXT NOT NULL, -- e.g., 'USER', 'PRODUCT', 'ORDER'
  entity_id TEXT, -- The ID of the affected record
  details TEXT NOT NULL -- A readable description of what happened
);

-- RLS Policies
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view the logs
CREATE POLICY "Allow read access to authenticated users" ON audit_logs 
  FOR SELECT TO authenticated USING (true);

-- Authenticated users can insert logs
CREATE POLICY "Allow insert access to authenticated users" ON audit_logs 
  FOR INSERT TO authenticated WITH CHECK (true);

-- Service role can read and insert
CREATE POLICY "Allow insert access to service role" ON audit_logs 
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Allow read access to service role" ON audit_logs 
  FOR SELECT TO service_role USING (true);
