// Supabase Edge Function: send-inquiry-email
//
// Triggered by a Database Webhook on `public.inquiries` (event: INSERT).
// Set up the webhook in Studio: Database -> Webhooks -> Create a new hook
// (see /supabase/README.md for exact steps). Runs on Deno, not Node.
//
// Required secrets (set with `supabase secrets set ...`, see README):
//   RESEND_API_KEY   - your Resend API key
//   NOTIFY_EMAIL     - the address that should receive new-inquiry emails
//   FROM_EMAIL       - optional, defaults to Resend's shared test sender

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const NOTIFY_EMAIL = Deno.env.get('NOTIFY_EMAIL');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'Lodhi Estates <onboarding@resend.dev>';

interface InquiryRecord {
  name: string;
  email: string;
  phone: string | null;
  interest: string | null;
  message: string;
  property_id: string | null;
  created_at: string;
}

interface WebhookPayload {
  type: 'INSERT';
  table: string;
  record: InquiryRecord;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!RESEND_API_KEY || !NOTIFY_EMAIL) {
    console.error('Missing RESEND_API_KEY or NOTIFY_EMAIL secret');
    return new Response(JSON.stringify({ error: 'Function is not configured' }), { status: 500 });
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const record = payload.record;
  if (!record?.email || !record?.name || !record?.message) {
    return new Response(JSON.stringify({ error: 'Payload missing required fields' }), { status: 400 });
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="margin-bottom: 4px;">New inquiry — ${escapeHtml(record.name)}</h2>
      <p style="color: #666; margin-top: 0;">via lodhiestates.com</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 6px 0; color: #666;">Email</td><td style="padding: 6px 0;">${escapeHtml(record.email)}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Phone</td><td style="padding: 6px 0;">${escapeHtml(record.phone ?? '—')}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Interested in</td><td style="padding: 6px 0;">${escapeHtml(record.interest ?? '—')}</td></tr>
      </table>
      <p style="white-space: pre-wrap; border-left: 3px solid #ddd; padding-left: 12px;">${escapeHtml(record.message)}</p>
    </div>
  `;

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      reply_to: record.email,
      subject: `New inquiry — ${record.name}`,
      html,
    }),
  });

  if (!resendRes.ok) {
    const errorText = await resendRes.text();
    console.error('Resend API error:', errorText);
    return new Response(JSON.stringify({ error: 'Failed to send email', details: errorText }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
