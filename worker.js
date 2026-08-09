const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/subscribe") {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed" }, 405);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid request" }, 400);
      }

      const email = String(body?.email || "").trim().toLowerCase();
      const interest = String(body?.interest || "").trim();

      if (!EMAIL_RE.test(email) || email.length > 254) {
        return json({ error: "Invalid email" }, 400);
      }

      if (!["updates", "paper_book"].includes(interest)) {
        return json({ error: "Invalid interest" }, 400);
      }

      try {
        const result = await env.DB.prepare(
          `INSERT OR IGNORE INTO subscribers (email, interest)
           VALUES (?, ?)`
        ).bind(email, interest).run();

        const inserted = Number(result?.meta?.changes || 0) > 0;
        return json({ ok: true, duplicate: !inserted });
      } catch (error) {
        console.error("D1 subscription error", error);
        return json({ error: "Database error" }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  }
};
