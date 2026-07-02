function normalizeCaptionLang(lang) {
  return String(lang || '').toLowerCase().startsWith('en') ? 'en' : 'hi';
}

export function getPreferredCaptionLang() {
  if (typeof window === 'undefined') return 'hi';

  const htmlLang =
    typeof document !== 'undefined' ? document.documentElement?.lang : '';
  const browserLang = window.navigator?.language || '';

  return normalizeCaptionLang(htmlLang || browserLang);
}

export function buildYouTubeEmbedUrl(videoId, extraParams = {}, lang) {
  const captionLang = normalizeCaptionLang(lang || getPreferredCaptionLang());
  const params = new URLSearchParams({
    cc_load_policy: '1',
    cc_lang_pref: captionLang,
    hl: captionLang,
  });

  Object.entries(extraParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });

  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
}