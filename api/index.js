const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const SYSTEM_PROMPT = `You are DetailBot, the friendly AI assistant for Bakersfield's Best Mobile Detailing. You help customers book appointments, answer questions about services, and close sales.

Business info:
- Phone: (661) 932-0000
- Location: Bakersfield, CA — we come TO the customer
- Hours: 7 days a week, 7am-7pm

Services & Pricing:
1. Dust-to-Diamonds Express — $80-$100 — foam bath, tire shine, vacuum, ceramic spray — 1-2 hrs
2. Full Interior/Exterior Reset — $180-$280 — full detail, steam clean, leather conditioning — 3-4 hrs
3. Surface Armor Package — $350-$500+ — ceramic coating, machine polish, 1-year protection — 5-6 hrs

Rules:
- Keep replies SHORT — 2-3 sentences max
- Always end with a question or call to action
- Upsell when appropriate
- When ready to book: "Scroll down to the booking form — takes 60 seconds! 🚗✨"`;

// CHAT
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  try {
    const messages = [...history.slice(-6), { role: 'user', content: message }];
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 300, system: SYSTEM_PROMPT, messages })
    });
    const data = await response.json();
    res.json({ reply: data.content?.[0]?.text || "Call us at (661) 932-0000!" });
  } catch (err) {
    res.status(500).json({ reply: "Call us at (661) 932-0000 — we're ready to help! 🚗" });
  }
});

// GET all invoices
app.get('/api/invoices', async (req, res) => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET single invoice
app.get('/api/invoices/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// CREATE invoice
app.post('/api/invoices', async (req, res) => {
  const id = Math.random().toString(36).slice(2,8).toUpperCase();
  const inv = { id, ...req.body, status: 'pending', created_at: new Date().toISOString() };
  const { data, error } = await supabase.from('invoices').insert(inv).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// UPDATE invoice
app.patch('/api/invoices/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('invoices')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE invoice
app.delete('/api/invoices/:id', async (req, res) => {
  const { error } = await supabase.from('invoices').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// STATS
app.get('/api/stats', async (req, res) => {
  const { data, error } = await supabase.from('invoices').select('*');
  if (error) return res.status(500).json({ error: error.message });
  const now = new Date();
  const thisMonth = data.filter(i => {
    const d = new Date(i.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const total = (arr) => arr.reduce((s,i) => s + (i.services||[]).reduce((ss,sv) => ss + parseFloat(sv.price||0), 0), 0);
  res.json({
    totalInvoices: data.length,
    pendingInvoices: data.filter(i => i.status === 'pending').length,
    paidInvoices: data.filter(i => i.status === 'paid').length,
    totalRevenue: total(data).toFixed(2),
    monthRevenue: total(thisMonth).toFixed(2),
    monthCount: thisMonth.length
  });
});

module.exports = app;
