// Client wrapper for /api/favorites — Redis-backed favorites keyed by caller IP
// (server reads req.ip; no client-side identity needed).

const API_BASE = '/api/favorites';

async function fetchJSON(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function fetchRemoteFavorites() {
  const data = await fetchJSON(API_BASE);
  return data.favorites || [];
}

export async function pushFavoriteToServer(video) {
  const data = await fetchJSON(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ video }),
  });
  return data.favorites || [];
}

export async function bulkReplaceFavoritesOnServer(videos) {
  const data = await fetchJSON(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videos }),
  });
  return data.favorites || [];
}

export async function deleteFavoriteOnServer(videoId) {
  const data = await fetchJSON(`${API_BASE}/${encodeURIComponent(videoId)}`, {
    method: 'DELETE',
  });
  return data.favorites || [];
}
