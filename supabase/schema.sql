-- Mehndibyritz Database Schema
-- Run this in the Supabase SQL Editor

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by user_id
CREATE INDEX uploads_user_id_idx ON uploads(user_id);

-- Index for ordering by created_at
CREATE INDEX uploads_created_at_idx ON uploads(created_at DESC);

-- Row Level Security (optional, since we use service role key on server)
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Allow service role to bypass RLS (already the default)
-- The app uses the service role key server-side, so no additional policies needed
-- If you want additional security, you can add policies here
