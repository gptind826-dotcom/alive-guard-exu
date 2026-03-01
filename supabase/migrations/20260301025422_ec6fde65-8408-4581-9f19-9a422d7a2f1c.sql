
-- Create endpoints table for persistent storage
CREATE TABLE public.endpoints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ping_logs table
CREATE TABLE public.ping_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint_id UUID NOT NULL REFERENCES public.endpoints(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'error')),
  status_code INTEGER,
  response_time INTEGER,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Public access (no auth needed for this app)
ALTER TABLE public.endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ping_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read/write endpoints" ON public.endpoints FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write ping_logs" ON public.ping_logs FOR ALL USING (true) WITH CHECK (true);

-- Index for faster log queries
CREATE INDEX idx_ping_logs_endpoint_id ON public.ping_logs(endpoint_id);
CREATE INDEX idx_ping_logs_created_at ON public.ping_logs(created_at DESC);
