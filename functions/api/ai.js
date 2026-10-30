// ===== AI SIDE (runs on Cloudflare, never in the visitor's browser) =====
// The website (public/index.html) sends { prompt } to POST /api/ai and gets { text } back.
// To change the AI provider later, edit ONLY callModel() below.

const MODEL = "@cf/meta/llama-3.1-8b-instruct"; // Free-tier Workers AI model. Names can be retired; see README.
const MAX_PROMPT_CHARS = 12000;                  // protects your free allowance from huge requests
const MAX_OUTPUT_TOKENS = 1100;

async function callModel(env, prompt) {
  if (!env.AI) throw new Error("AI binding is not configured");
  const out = await env.AI.run(MODEL, {
    messages: [{ role: "user", content: prompt }],
    max_tokens: MAX_OUTPUT_TOKENS,
  });
  return typeof out.response === "string" ? out.response : JSON.stringify(out.response ?? "");
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export async function onRequestPost({ request, env }) {
  // Only accept requests that come from our own website.
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) return json({ error: "Forbidden" }, 403);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Bad request" }, 400); }
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt || prompt.length > MAX_PROMPT_CHARS) return json({ error: "Invalid request" }, 400);

  try {
    return json({ text: await callModel(env, prompt) });
  } catch (e) {
    const msg = String((e && e.message) || e);
    const limited = /limit|quota|capacity|neurons/i.test(msg);
    return json({ error: limited ? "The free AI allowance is used up for today. Please try again tomorrow." : "The AI service had a problem. Please try again." }, limited ? 429 : 502);
  }
}
