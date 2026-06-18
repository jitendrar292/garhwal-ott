// AdUnit — Google AdSense display ad (horizontal / responsive)
// Usage: <AdUnit />
// The adsbygoogle script is already loaded globally in index.html.

import { useEffect, useRef, useState } from 'react';

const AD_CLIENT = 'ca-pub-7371728042133909';
const AD_SLOT   = '6273839895';

function useAdVisibility(insRef) {
  const [isResolved, setIsResolved] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 8;

    const timer = setInterval(() => {
      attempts += 1;
      const ins = insRef.current;
      if (!ins) return;

      const status = ins.getAttribute('data-ad-status');
      const hasIframe = !!ins.querySelector('iframe');

      if (status === 'filled' || hasIframe) {
        setIsFilled(true);
        setIsResolved(true);
        clearInterval(timer);
        return;
      }

      if (status === 'unfilled') {
        setIsFilled(false);
        setIsResolved(true);
        clearInterval(timer);
        return;
      }

      if (attempts >= maxAttempts) {
        setIsFilled(false);
        setIsResolved(true);
        clearInterval(timer);
      }
    }, 250);

    return () => clearInterval(timer);
  }, [insRef]);

  return !isResolved || isFilled;
}

export default function AdUnit({ className = '' }) {
  const ref = useRef(null);
  const pushed = useRef(false);
  const showSlot = useAdVisibility(ref);

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
    <div className={`w-full overflow-hidden transition-all duration-300 ${showSlot ? 'my-6 min-h-[250px]' : 'my-0 min-h-0 h-0'} ${className}`}>
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
  const ref = useRef(null);
  const pushed = useRef(false);
  const showSlot = useAdVisibility(ref);

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
    <div className={`w-full overflow-hidden transition-all duration-300 ${showSlot ? 'my-5 min-h-[120px]' : 'my-0 min-h-0 h-0'} ${className}`}>
      <ins
        ref={ref}
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
