// /functions/players.js
export async function onRequestGet({ env }) {
  try {
    // Get all players from D1
    const { results } = await env.DB.prepare("SELECT * FROM players").all();
    return Response.json(results);
  } catch (err) {
    console.error("GET /players error:", err);
    return new Response("Failed to fetch players", { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    // Ensure required fields exist
    if (!data.name || !data.class || !data.level) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Insert new player record
    await env.DB.prepare(
      `INSERT INTO players (name, class, level, created_at) VALUES (?, ?, ?, datetime('now'))`
    )
      .bind(data.name, data.class, data.level)
      .run();

    return new Response("Player added successfully", { status: 200 });
  } catch (err) {
    console.error("POST /players error:", err);
    return new Response("Failed to add player", { status: 500 });
  }
}
