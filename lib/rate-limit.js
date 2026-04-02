/**
 * rate-limit.js — Rate limiter em memória para Next.js + PM2 (VPS)
 *
 * Funciona enquanto o processo Node.js estiver ativo (PM2 mantém em memória).
 * Para arquitetura serverless/multi-instância, substituir por Redis.
 */

const store = new Map(); // { key: { count, resetAt } }

/**
 * Verifica e registra uma tentativa para a chave informada.
 *
 * @param {string} key        — Identificador único (ex: "login:1.2.3.4")
 * @param {number} limit      — Máximo de tentativas permitidas
 * @param {number} windowMs   — Janela de tempo em milissegundos
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
export function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // Janela nova ou expirada
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Extrai o IP real do request, considerando proxies (Nginx).
 * @param {Request} request
 * @returns {string}
 */
export function getIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Limpa entradas expiradas a cada 10 minutos para evitar memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 10 * 60 * 1000);
