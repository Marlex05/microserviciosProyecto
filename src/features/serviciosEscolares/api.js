const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function api(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.msg || res.statusText);
  }
  return res.json().catch(() => ({}));
}
