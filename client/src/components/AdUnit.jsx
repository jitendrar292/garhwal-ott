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
    
    // Wait for adsbygoogle to be available
    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: AD_CLIENT,
          enable_page_level_ads: true
        });
      } catch (error) {
        console.warn('AdSense error:', error);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full overflow-hidden my-6 min-h-[250px] ${className}`}>
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

// AdUnitFluid — in-feed / native fluid ad
// Usage: <AdUnitFluid />
const FLUID_SLOT       = '5995244505';
const FLUID_LAYOUT_KEY = '-fb+5w+4e-db+86';

export function AdUnitFluid({ className = '' }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    
    // Wait for adsbygoogle to be available
    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: AD_CLIENT,
          enable_page_level_ads: true
        });
      } catch (error) {
        console.warn('AdSense error:', error);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full overflow-hidden my-6 min-h-[250px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key={FLUID_LAYOUT_KEY}
        data-ad-client={AD_CLIENT}
        data-ad-slot={FLUID_SLOT}
      />
    </div>
  );
}
