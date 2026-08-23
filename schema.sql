-- ==========================================================================
-- GUS ENTERPRISE DUAL FRANCHISE NETWORK - SUPABASE DATABASE SCHEMA
-- Execute this SQL script in your Supabase SQL Editor
-- ==========================================================================

-- 1. Create B2B Wholesale Franchises Table
CREATE TABLE IF NOT EXISTS b2b_franchises (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  pin VARCHAR(10) NOT NULL,
  type VARCHAR(50) DEFAULT 'Micro',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create B2B Wholesale Orders Table
CREATE TABLE IF NOT EXISTS b2b_orders (
  id VARCHAR(50) PRIMARY KEY,
  franchise_id VARCHAR(50) REFERENCES b2b_franchises(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  item_details TEXT NOT NULL,
  revenue_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create B2C Retail Store Franchises Table
CREATE TABLE IF NOT EXISTS b2c_franchises (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  pin VARCHAR(10) NOT NULL,
  type VARCHAR(50) DEFAULT 'Retail Store',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create B2C Retail Store Orders Table
CREATE TABLE IF NOT EXISTS b2c_orders (
  id VARCHAR(50) PRIMARY KEY,
  franchise_id VARCHAR(50) REFERENCES b2c_franchises(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  item_details TEXT NOT NULL,
  revenue_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Seed B2B Franchises
INSERT INTO b2b_franchises (id, name, location, pin, type) VALUES
('FRAN-SIVAGANGAI', 'Vinoth (B2B Master Partner)', 'Sivagangai Wholesale Hub', '9842', 'Master'),
('FRAN-CHENNAI', 'Rajesh Kumar', 'Chennai Central Wholesale', '1234', 'Micro'),
('FRAN-MADURAI', 'Karthik Raja', 'Madurai West Hub', '2345', 'Micro'),
('FRAN-COIMBATORE', 'Anitha Ramesh', 'Coimbatore RS Puram Hub', '3456', 'Micro')
ON CONFLICT (id) DO NOTHING;

-- 6. Seed B2C Retail Franchises
INSERT INTO b2c_franchises (id, name, location, pin, type) VALUES
('RETAIL-TRICHY', 'Senthil Nathan (B2C Retail Owner)', 'Trichy Main Road Outlet', '8811', 'Retail Store'),
('RETAIL-MADURAI', 'Meenakshi Sundaram', 'Madurai Temple View Outlet', '7722', 'Retail Store'),
('RETAIL-CHENNAI', 'Praveen V', 'Chennai T.Nagar Outlet', '6633', 'Retail Store')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) & Public Access Policies
ALTER TABLE b2b_franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2c_franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2c_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to b2b_franchises" ON b2b_franchises FOR SELECT USING (true);
CREATE POLICY "Allow public write access to b2b_franchises" ON b2b_franchises FOR ALL USING (true);
CREATE POLICY "Allow public read access to b2b_orders" ON b2b_orders FOR SELECT USING (true);
CREATE POLICY "Allow public write access to b2b_orders" ON b2b_orders FOR ALL USING (true);

CREATE POLICY "Allow public read access to b2c_franchises" ON b2c_franchises FOR SELECT USING (true);
CREATE POLICY "Allow public write access to b2c_franchises" ON b2c_franchises FOR ALL USING (true);
CREATE POLICY "Allow public read access to b2c_orders" ON b2c_orders FOR SELECT USING (true);
CREATE POLICY "Allow public write access to b2c_orders" ON b2c_orders FOR ALL USING (true);
