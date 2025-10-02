export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/players" && request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM players ORDER BY created_at ASC").all();
      return Response.json(results);
    }

    if (url.pathname === "/players" && request.method === "POST") {
      const body = await request.json();
      await env.DB.prepare("INSERT INTO players (name, character, sheet, avatar, notes) VALUES (?, ?, ?, ?, ?)")
        .bind(body.name, body.character, body.sheet, body.avatar, body.notes).run();
      return Response.json({ status: "success" });
    }

    if (url.pathname === "/chat" && request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM chat ORDER BY created_at DESC LIMIT 20").all();
      return Response.json(results);
    }

    if (url.pathname === "/chat" && request.method === "POST") {
      const body = await request.json();
      await env.DB.prepare("INSERT INTO chat (user, message) VALUES (?, ?)")
        .bind(body.user, body.message).run();
      return Response.json({ status: "success" });
    }

    return new Response("Not Found", { status: 404 });
  }
};
