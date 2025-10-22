// /functions/players.js
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function jsonResponse(data, init = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...corsHeaders,
    ...(init.headers || {})
  };

  return new Response(JSON.stringify(data), { ...init, headers });
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM players ORDER BY created_at ASC"
    ).all();

    return jsonResponse(results);
  } catch (err) {
    console.error("GET /players error:", err);
    return jsonResponse({ error: "Failed to fetch players" }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    const requiredFields = ["name", "character", "sheet", "avatar"];
    const missingField = requiredFields.find((field) => !data[field]);
    if (missingField) {
      return jsonResponse({ error: `Missing required field: ${missingField}` }, { status: 400 });
    }

    await env.DB.prepare(
      "INSERT INTO players (name, character, sheet, avatar, notes, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))"
    )
      .bind(data.name, data.character, data.sheet, data.avatar, data.notes || null)
      .run();

    return jsonResponse({ status: "success" }, { status: 201 });
  } catch (err) {
    console.error("POST /players error:", err);
    return jsonResponse({ error: "Failed to add player" }, { status: 500 });
  }
}
