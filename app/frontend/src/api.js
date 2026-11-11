const USER_ID = "demo-user-1";

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": USER_ID,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    throw new Error("Please log in to manage favorites.");
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function toggleFavorite(movieId) {
  return request("/api/v1/favorites", {
    method: "POST",
    body: JSON.stringify({ movieId }),
  });
}

export function listFavorites() {
  return request("/api/v1/favorites");
}

export function removeFavorite(movieId) {
  return request(`/api/v1/favorites/${encodeURIComponent(movieId)}`, {
    method: "DELETE",
  });
}
