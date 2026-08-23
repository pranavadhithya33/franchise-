-- ==========================================================================
-- BREAKING BAD FRANCHISE NETWORK - SUPABASE DATABASE SCHEMA
-- Execute this SQL script in your Supabase SQL Editor
-- ==========================================================================

-- 1. Create Franchises Table
CREATE TABLE IF NOT EXISTS franchises (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  pin VARCHAR(10) NOT NULL,
  type VARCHAR(50) DEFAULT 'Micro',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  franchise_id VARCHAR(50) REFERENCES franchises(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  item_details TEXT NOT NULL,
  revenue_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seed Default Franchise Partners
INSERT INTO franchises (id, name, location, pin, type) VALUES
('FRAN-SIVAGANGAI', 'Vinoth (Master Partner)', 'Sivagangai', '9842', 'Master'),
('FRAN-CHENNAI', 'Rajesh Kumar', 'Chennai Central', '1234', 'Micro'),
('FRAN-MADURAI', 'Karthik Raja', 'Madurai West', '2345', 'Micro'),
('FRAN-COIMBATORE', 'Anitha Ramesh', 'Coimbatore RS Puram', '3456', 'Micro'),
('FRAN-SALEM', 'Selvam Subramanian', 'Salem Junction', '4567', 'Micro'),
('FRAN-TRICHY', 'Manikandan P', 'Trichy Cantt', '5678', 'Micro')
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Initial Orders
INSERT INTO orders (id, franchise_id, customer_name, item_details, revenue_amount, status) VALUES
('ORD-1001', 'FRAN-SIVAGANGAI', 'Saul Goodman', 'iPhone 15 Pro Max 256GB', 125000, 'Finished'),
('ORD-1002', 'FRAN-SIVAGANGAI', 'Gustavo Fring', 'Samsung Galaxy S24 Ultra', 110000, 'Finished'),
('ORD-1003', 'FRAN-CHENNAI', 'Walter White', 'MacBook Pro 14 M3', 165000, 'Finished'),
('ORD-1004', 'FRAN-MADURAI', 'Jesse Pinkman', 'iPad Pro 12.9 M2', 95000, 'Finished'),
('ORD-1005', 'FRAN-COIMBATORE', 'Mike Ehrmantraut', 'OnePlus 12 512GB', 65000, 'Processing'),
('ORD-1006', 'FRAN-SALEM', 'Hank Schrader', 'Sony WH-1000XM5', 28000, 'Pending')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) & Public Read Policies
ALTER TABLE franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to franchises" ON franchises FOR SELECT USING (true);
CREATE POLICY "Allow public read access to orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public write access to orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to orders" ON orders FOR UPDATE USING (true);
