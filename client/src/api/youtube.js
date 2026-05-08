const API_BASE = '/api/youtube';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

// Default page size is 10 — keeps each fetch lightweight (5–10 max policy)
// and limits how many thumbnails the browser has to decode/lay out per page.
export async function searchVideos(query, pageToken = '', maxResults = 10, order = '', videoCategoryId = '') {
  const params = new URLSearchParams({ q: query, maxResults: String(maxResults) });
  if (pageToken) params.set('pageToken', pageToken);
  if (order) params.set('order', order);
  if (videoCategoryId) params.set('videoCategoryId', videoCategoryId);
  return fetchJSON(`${API_BASE}/search?${params}`);
}

export async function getVideosByCategory(category, pageToken = '', maxResults = 10) {
  const params = new URLSearchParams({ maxResults: String(maxResults) });
  if (pageToken) params.set('pageToken', pageToken);
  return fetchJSON(`${API_BASE}/category/${encodeURIComponent(category)}?${params}`);
}
