// AdUnit — Google AdSense display ad (horizontal / responsive)
// Usage: <AdUnit />
// The adsbygoogle script is already loaded globally in index.html.

import { useEffect, useRef } from 'react';

const AD_CLIENT = 'ca-pub-7371728042133909';
const AD_SLOT   = '6273839895';

export default function AdUnit({ className = '' }) {
  const ref = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Only push once per mount; guard against StrictMode double-invoke
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <div className={`w-full overflow-hidden my-6 ${className}`}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
