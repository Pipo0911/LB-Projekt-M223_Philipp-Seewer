const BASE_URL = "http://localhost:8080";

/** Liest den JWT-Token aus dem localStorage (gespeichert von AuthContext). */
function getAuthHeader() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  } catch {
    return {};
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      // JWT-Token wird automatisch bei jedem Request mitgeschickt
      ...getAuthHeader(),
      ...(options.headers || {}),
    },
    body: options.body,
    signal: options.signal,
  });

  if (res.status === 204) return { ok: true, status: 204 };

  const contentType = res.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    const text = await res.text();
    data = text ? { message: text } : null;
  }

  if (!res.ok) {
    throw {
      error: "REQUEST_FAILED",
      status: res.status,
      path,
      ...(data && typeof data === "object" ? data : { detail: data }),
    };
  }

  return data;
}

export const api = {
  listGames: () => request("/api/games"),
  getGame: (id) => request(`/api/games/${encodeURIComponent(id)}`),

  createGame: (data) =>
    request("/api/games", { method: "POST", body: JSON.stringify(data) }),

  updateGame: (id, data) =>
    request(`/api/games/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteGame: (id) =>
    request(`/api/games/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
