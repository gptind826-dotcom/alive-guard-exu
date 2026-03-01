import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get all active endpoints
  const { data: endpoints, error } = await supabase
    .from("endpoints")
    .select("*")
    .eq("is_active", true);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const results = [];

  for (const endpoint of endpoints || []) {
    const start = Date.now();
    let status = "online";
    let statusCode: number | null = null;
    let message = "";

    try {
      const response = await fetch(endpoint.url, {
        method: "GET",
        signal: AbortSignal.timeout(15000),
      });
      statusCode = response.status;
      status = response.ok ? "online" : "error";
      message = `HTTP ${response.status}`;
    } catch (err: any) {
      status = "offline";
      message = err.message || "Network error";
    }

    const responseTime = Date.now() - start;

    // Log the ping
    await supabase.from("ping_logs").insert({
      endpoint_id: endpoint.id,
      url: endpoint.url,
      status,
      status_code: statusCode,
      response_time: responseTime,
      message,
    });

    results.push({
      url: endpoint.url,
      status,
      statusCode,
      responseTime,
      message,
    });
  }

  return new Response(JSON.stringify({ results, pinged: results.length }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
