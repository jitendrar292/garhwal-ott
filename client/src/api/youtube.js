const API_BASE = '/api/youtube';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function searchVideos(query, pageToken = '', maxResults = 12) {
  const params = new URLSearchParams({ q: query, maxResults: String(maxResults) });
  if (pageToken) params.set('pageToken', pageToken);
  return fetchJSON(`${API_BASE}/search?${params}`);
}

export async function getVideosByCategory(category, pageToken = '', maxResults = 12) {
  const params = new URLSearchParams({ maxResults: String(maxResults) });
  if (pageToken) params.set('pageToken', pageToken);
  return fetchJSON(`${API_BASE}/category/${encodeURIComponent(category)}?${params}`);
}
