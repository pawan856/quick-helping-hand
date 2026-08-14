import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const MODEL = 'google/gemini-3.5-flash';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'AI is not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authHeader = req.headers.get('Authorization') ?? '';
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => null);
    const messages = Array.isArray(body?.messages) ? body.messages : null;
    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cleanMessages = messages
      .filter((m: unknown) => {
        const msg = m as { role?: string; content?: string };
        return (
          (msg.role === 'user' || msg.role === 'assistant') &&
          typeof msg.content === 'string' &&
          msg.content.trim().length > 0
        );
      })
      .slice(-20)
      .map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content.slice(0, 8000),
      }));

    // Live clinical context (RLS-scoped to the signed-in staff member)
    const [{ data: patients }, { data: alerts }, { data: appointments }] = await Promise.all([
      supabase
        .from('patients')
        .select('full_name, mrn, status, risk_score, primary_condition, blood_group')
        .order('risk_score', { ascending: false })
        .limit(25),
      supabase
        .from('alerts')
        .select('severity, category, message, acknowledged, created_at')
        .eq('acknowledged', false)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('appointments')
        .select('scheduled_at, appointment_type, status, patients(full_name)')
        .order('scheduled_at', { ascending: true })
        .limit(20),
    ]);

    const systemPrompt = [
      'You are the clinical assistant inside HealthCare Pro, a hospital operations platform used by clinicians.',
      'Be concise, structured and use markdown-free short paragraphs or simple dashes.',
      'Use the live data below when relevant. If data is missing, say so instead of inventing it.',
      'Never give definitive diagnoses; frame clinical suggestions as considerations for the treating clinician.',
      '',
      `PATIENTS (${patients?.length ?? 0}): ${JSON.stringify(patients ?? [])}`,
      `OPEN ALERTS (${alerts?.length ?? 0}): ${JSON.stringify(alerts ?? [])}`,
      `UPCOMING APPOINTMENTS (${appointments?.length ?? 0}): ${JSON.stringify(appointments ?? [])}`,
    ].join('\n');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': apiKey,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [{ role: 'system', content: systemPrompt }, ...cleanMessages],
      }),
    });

    if (!aiResponse.ok) {
      const detail = await aiResponse.text();
      const status = aiResponse.status === 429 || aiResponse.status === 402 ? aiResponse.status : 500;
      const error =
        aiResponse.status === 429
          ? 'AI rate limit reached. Please try again in a moment.'
          : aiResponse.status === 402
            ? 'AI credits exhausted. Add credits to continue using the assistant.'
            : `AI request failed: ${detail.slice(0, 300)}`;
      return new Response(JSON.stringify({ error }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(aiResponse.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
