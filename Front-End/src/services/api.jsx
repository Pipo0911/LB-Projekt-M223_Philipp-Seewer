const BASE_URL = "http://localhost:8080";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
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
  listGames: () => request("/games"),
  getGame: (id) => request(`/games/${encodeURIComponent(id)}`),

  createGame: (data) =>
    request("/games", { method: "POST", body: JSON.stringify(data) }),

  updateGame: (id, data) =>
    request(`/games/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteGame: (id) =>
    request(`/games/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
