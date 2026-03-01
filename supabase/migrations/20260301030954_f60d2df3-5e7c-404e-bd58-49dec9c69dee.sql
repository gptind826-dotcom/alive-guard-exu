
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  ping_interval INTEGER NOT NULL DEFAULT 60,
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  theme TEXT NOT NULL DEFAULT 'dark',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Add user_id to endpoints (nullable for existing data)
ALTER TABLE public.endpoints ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive policy on endpoints and create user-scoped ones
DROP POLICY IF EXISTS "Public read/write endpoints" ON public.endpoints;

CREATE POLICY "Users can view their own endpoints"
  ON public.endpoints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own endpoints"
  ON public.endpoints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own endpoints"
  ON public.endpoints FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own endpoints"
  ON public.endpoints FOR UPDATE
  USING (auth.uid() = user_id);

-- Drop old policy on ping_logs and create user-scoped
DROP POLICY IF EXISTS "Public read/write ping_logs" ON public.ping_logs;

CREATE POLICY "Users can view logs for their endpoints"
  ON public.ping_logs FOR SELECT
  USING (endpoint_id IN (SELECT id FROM public.endpoints WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert logs for their endpoints"
  ON public.ping_logs FOR INSERT
  WITH CHECK (endpoint_id IN (SELECT id FROM public.endpoints WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete logs for their endpoints"
  ON public.ping_logs FOR DELETE
  USING (endpoint_id IN (SELECT id FROM public.endpoints WHERE user_id = auth.uid()));

-- Service role policy for edge function (keep-alive cron)
CREATE POLICY "Service role full access endpoints"
  ON public.endpoints FOR SELECT
  USING (true);

CREATE POLICY "Service role full access ping_logs"
  ON public.ping_logs FOR INSERT
  WITH CHECK (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
