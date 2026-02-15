-- Enable Realtime for tables
-- Run this in Supabase SQL Editor

-- 1. Events
alter publication supabase_realtime add table events;

-- 2. Clients
alter publication supabase_realtime add table clients;

-- 3. Scripts
alter publication supabase_realtime add table scripts;

-- 4. Users
alter publication supabase_realtime add table app_users;

-- Note: If you see an error like "relation ... is already member of publication", 
-- it means Realtime is ALREADY ENABLED for that table. You can ignore it.
