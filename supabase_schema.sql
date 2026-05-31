-- ========================================================
--  TIKTOK PRO TERMINAL - DATABASE SCHEMA SETUP
-- ========================================================
-- Run this script in your Supabase SQL Editor to create the necessary tables.

-- 1. Create the 'channels' table
CREATE TABLE IF NOT EXISTS public.channels (
    id TEXT PRIMARY KEY,
    handle TEXT NOT NULL,
    name TEXT NOT NULL,
    followers TEXT NOT NULL DEFAULT '0',
    account_type TEXT NOT NULL CHECK (account_type IN ('OAuth App', 'Personal')),
    status TEXT NOT NULL CHECK (status IN ('Connected', 'Expired', 'Pending')),
    avatar TEXT NOT NULL,
    expires_in TEXT,
    posts_count INTEGER DEFAULT 0,
    access_token TEXT,
    refresh_token TEXT,
    token_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. Create the 'scheduled_posts' table
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    caption TEXT NOT NULL,
    hashtags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    channel_id TEXT NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Scheduled', 'Uploading', 'Posted', 'Failed')),
    video_url TEXT NOT NULL,
    music_name TEXT NOT NULL,
    views_count TEXT,
    likes_count TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. Enable Row Level Security (RLS) for public access or configure policy
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

-- 4. Create public read/write access policies (for development simplicity)
CREATE POLICY "Allow public read channels" ON public.channels FOR SELECT USING (true);
CREATE POLICY "Allow public insert channels" ON public.channels FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update channels" ON public.channels FOR UPDATE USING (true);
CREATE POLICY "Allow public delete channels" ON public.channels FOR DELETE USING (true);

CREATE POLICY "Allow public read posts" ON public.scheduled_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert posts" ON public.scheduled_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update posts" ON public.scheduled_posts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete posts" ON public.scheduled_posts FOR DELETE USING (true);

-- 5. Seed initial placeholder channels (matches dashboard seed logic)
INSERT INTO public.channels (id, handle, name, followers, account_type, status, avatar, expires_in, posts_count)
VALUES 
('ch01', '@devwooyoujake', 'DevWooYou Jake', '1.2M', 'OAuth App', 'Connected', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop', '280 วัน', 142),
('ch02', '@luna_cosmetics', 'FXLUNA Pro Cosmetics', '850K', 'OAuth App', 'Connected', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop', '310 วัน', 98),
('ch03', '@devjuu_vlogs', 'DevJuu Lifestyle & Tech', '240K', 'Personal', 'Connected', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop', NULL, 45),
('ch04', '@knize_gaming', 'KnizeShop Gaming Studio', '45K', 'Personal', 'Expired', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop', NULL, 12)
ON CONFLICT (id) DO NOTHING;
