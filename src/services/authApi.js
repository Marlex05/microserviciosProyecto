const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function http(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

export function login({ username, password }) {
  return http("/login", { method: "POST", body: { username, password } });
}

export function changePassword({ userId, oldPassword, newPassword }) {
  return http("/cuenta/password", { method: "PATCH", body: { userId, oldPassword, newPassword } });
}
