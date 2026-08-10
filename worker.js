function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

async function ensureBookCounter(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS book_interest (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      count INTEGER NOT NULL DEFAULT 0
    )
  `).run();

  await env.DB.prepare(`
    INSERT OR IGNORE INTO book_interest (id, count) VALUES (1, 0)
  `).run();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/book-interest") {
      await ensureBookCounter(env);

      if (request.method === "GET") {
        const row = await env.DB.prepare(
          "SELECT count FROM book_interest WHERE id = 1"
        ).first();
        return json({ count: Number(row?.count || 0) });
      }

      if (request.method === "POST") {
        await env.DB.prepare(
          "UPDATE book_interest SET count = count + 1 WHERE id = 1"
        ).run();

        const row = await env.DB.prepare(
          "SELECT count FROM book_interest WHERE id = 1"
        ).first();
        return json({ ok: true, count: Number(row?.count || 0) });
      }

      return json({ error: "Method not allowed" }, 405);
    }

    return env.ASSETS.fetch(request);
  }
};
