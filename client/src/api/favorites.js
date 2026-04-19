// Client wrapper for /api/favorites — Redis-backed per-device favorites.
// Each browser/install has its own deviceId persisted in localStorage.

const API_BASE = '/api/favorites';
const DEVICE_ID_KEY = 'pahadi_tube_device_id';

function generateDeviceId() {
  // crypto.randomUUID is available in all modern browsers + Node 19+
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback (older Safari, etc.)
  return 'dev-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getDeviceId() {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = generateDeviceId();
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    // Private mode / storage disabled — fall back to ephemeral id
    return generateDeviceId();
  }
}

async function fetchJSON(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function fetchRemoteFavorites() {
  const deviceId = getDeviceId();
  const data = await fetchJSON(`${API_BASE}?deviceId=${encodeURIComponent(deviceId)}`);
  return data.favorites || [];
}

export async function pushFavoriteToServer(video) {
  const deviceId = getDeviceId();
  const data = await fetchJSON(`${API_BASE}?deviceId=${encodeURIComponent(deviceId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ video }),
  });
  return data.favorites || [];
}

export async function bulkReplaceFavoritesOnServer(videos) {
  const deviceId = getDeviceId();
  const data = await fetchJSON(`${API_BASE}?deviceId=${encodeURIComponent(deviceId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videos }),
  });
  return data.favorites || [];
}

export async function deleteFavoriteOnServer(videoId) {
  const deviceId = getDeviceId();
  const data = await fetchJSON(
    `${API_BASE}/${encodeURIComponent(videoId)}?deviceId=${encodeURIComponent(deviceId)}`,
    { method: 'DELETE' }
  );
  return data.favorites || [];
}
