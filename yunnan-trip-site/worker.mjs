const ids = new Set(['train-0926','yulong-0928','shangri-0930','transfer','hotel-phone','holiday-check']);
const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (url.pathname !== '/api/todos') return json({error:'接口不存在'},404);
    if (!env.DB) return json({error:'共享清单尚未配置，请联系组织者'},503);
    try {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT id, checked FROM todos').all();
        return json({todos:Object.fromEntries(results.map(row=>[row.id,!!row.checked]))});
      }
      if (request.method !== 'PUT') return json({error:'不支持的请求方式'},405);
      if (request.headers.get('Origin') && request.headers.get('Origin') !== url.origin) return json({error:'来源不允许'},403);
      if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({error:'需要 JSON'},415);
      const raw = await request.text();
      if (raw.length > 1024) return json({error:'请求过大'},413);
      let body;
      try { body=JSON.parse(raw); } catch { return json({error:'请求格式错误'},400); }
      if (!body || !ids.has(body.id) || typeof body.checked !== 'boolean' || !/^[a-f0-9-]{36}$/.test(body.operation || '')) return json({error:'待办数据无效'},400);
      // A retried offline operation must never overwrite a later participant's update.
      await env.DB.batch([
        env.DB.prepare('INSERT INTO todos (id, checked) SELECT ?1, ?2 WHERE NOT EXISTS (SELECT 1 FROM operations WHERE id=?3) ON CONFLICT(id) DO UPDATE SET checked=excluded.checked').bind(body.id,Number(body.checked),body.operation),
        env.DB.prepare('INSERT OR IGNORE INTO operations (id) VALUES (?)').bind(body.operation)
      ]);
      return json({ok:true});
    } catch {
      return json({error:'云端暂时不可用，请稍后重试'},503);
    }
  }
};
