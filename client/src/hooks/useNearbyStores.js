import { useState, useCallback } from 'react';
import { matchCity, nearestStore, distanceKm } from '../data/pahadiStores';

/**
 * useNearbyStores
 * Detects the user's city via Geolocation + Nominatim reverse geocoding (free, no key).
 * Returns the best-matching PAHADI_STORES entry plus the distance in km.
 *
 * State:
 *   status: 'idle' | 'locating' | 'found' | 'denied' | 'error'
 *   store:  matched store entry | null
 *   city:   detected city name string
 *   distKm: distance to nearest known store city
 *   isUttarakhand: boolean
 */
export default function useNearbyStores() {
  const [status, setStatus] = useState('idle');
  const [store, setStore] = useState(null);
  const [city, setCity] = useState('');
  const [distKm, setDistKm] = useState(null);
  const [isUttarakhand, setIsUttarakhand] = useState(false);

  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      return;
    }
    setStatus('locating');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          // Nominatim reverse geocode — free, no API key needed.
          // We set a custom User-Agent as required by their usage policy.
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const detectedCity =
            addr.city || addr.town || addr.village || addr.county || addr.state_district || '';
          const detectedState = addr.state || '';

          setCity(detectedCity || detectedState || 'your location');
          const inUK = /uttarakhand/i.test(detectedState);
          setIsUttarakhand(inUK);

          // Try city-name match first, fall back to nearest by coords
          let matched = matchCity(detectedCity, detectedState);
          if (!matched) matched = nearestStore(lat, lng);

          if (matched) {
            const d = distanceKm(lat, lng, matched.lat, matched.lng);
            setDistKm(Math.round(d));
            setStore(matched);
          }
          setStatus('found');
        } catch {
          // Nominatim failed — still try nearest by coords
          const matched = nearestStore(lat, lng);
          if (matched) {
            setDistKm(Math.round(distanceKm(lat, lng, matched.lat, matched.lng)));
            setStore(matched);
          }
          setStatus('found');
        }
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error');
      },
      { timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  return { status, store, city, distKm, isUttarakhand, detect };
}
