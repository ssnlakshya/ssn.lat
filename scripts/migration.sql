
-- Step 1: Add analytics_token column to urls table (if not exists)
ALTER TABLE urls 
ADD COLUMN IF NOT EXISTS analytics_token TEXT UNIQUE;

-- Step 2: Create clicks table (if not exists) for detailed click tracking
CREATE TABLE IF NOT EXISTS clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_code TEXT NOT NULL REFERENCES urls(short_code) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  ip TEXT
);

-- Step 3: Create indexes for faster queries (if not exists)
CREATE INDEX IF NOT EXISTS idx_clicks_short_code ON clicks(short_code);
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at);
