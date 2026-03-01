
-- The service role policies are needed for the edge function cron job.
-- Make the ping_logs INSERT policy restrictive by checking the endpoint exists
DROP POLICY IF EXISTS "Service role full access ping_logs" ON public.ping_logs;
CREATE POLICY "Allow insert ping_logs for existing endpoints"
  ON public.ping_logs FOR INSERT
  WITH CHECK (endpoint_id IN (SELECT id FROM public.endpoints));
