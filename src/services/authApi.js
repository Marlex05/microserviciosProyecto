const AUTH = import.meta.env.VITE_AUTH_URL;

async function http(path, { method = "GET", body } = {}) {
  const res = await fetch(`${AUTH}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

export const login = ({ username, password }) =>
  http("/login", { method: "POST", body: { username, password } });

export const changePassword = ({ userId, oldPassword, newPassword }) =>
  http("/cuenta/password", { method: "PATCH", body: { userId, oldPassword, newPassword } });
