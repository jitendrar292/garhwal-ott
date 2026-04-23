import { useEffect, useState } from 'react';

// Bell button to subscribe / unsubscribe to news push notifications.
// Renders nothing until we've checked browser support + current state.

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

const SUPPORTED =
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window;

// Auto-subscribe to push notifications (called after login)
// Returns true if subscribed successfully
export async function autoSubscribeToPush() {
  if (!SUPPORTED) {
    console.log('[notify] Push not supported');
    return false;
  }
  
  try {
    // Check if already subscribed
    const reg = await navigator.serviceWorker.ready;
    const existingSub = await reg.pushManager.getSubscription();
    if (existingSub) {
      console.log('[notify] Already subscribed to push');
      return true;
    }
    
    // Check if permission already denied
    if (Notification.permission === 'denied') {
      console.log('[notify] Notification permission denied');
      return false;
    }
    
    // Request permission
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      console.log('[notify] Permission not granted:', perm);
      return false;
    }
    
    // Get VAPID key
    const keyRes = await fetch('/api/push/vapid-public-key');
    if (!keyRes.ok) {
      console.log('[notify] VAPID key not available');
      return false;
    }
    const { publicKey } = await keyRes.json();
    
    // Subscribe
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    
    // Send subscription to server
    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub),
    });
    
    if (!res.ok) {
      console.error('[notify] Subscribe to server failed');
      return false;
    }
    
    console.log('[notify] Auto-subscribed to push notifications');
    return true;
  } catch (err) {
    console.error('[notify] Auto-subscribe error:', err);
    return false;
  }
}

export default function NotifyButton() {
  const [state, setState] = useState('loading'); // loading | subscribed | unsubscribed | denied | unsupported | unavailable
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!SUPPORTED) {
      setState('unsupported');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        if (Notification.permission === 'denied') {
          if (!cancelled) setState('denied');
          return;
        }
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (cancelled) return;
        setState(sub ? 'subscribed' : 'unsubscribed');
      } catch {
        if (!cancelled) setState('unavailable');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const subscribe = async () => {
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        setState(perm === 'denied' ? 'denied' : 'unsubscribed');
        return;
      }
      const keyRes = await fetch('/api/push/vapid-public-key');
      if (!keyRes.ok) {
        setState('unavailable');
        return;
      }
      const { publicKey } = await keyRes.json();
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });
      if (!res.ok) throw new Error('subscribe failed');
      setState('subscribed');
    } catch (err) {
      console.error('[notify] subscribe error', err);
      setState('unavailable');
    } finally {
      setBusy(false);
    }
  };

  const unsubscribe = async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => {});
        await sub.unsubscribe();
      }
      setState('unsubscribed');
    } finally {
      setBusy(false);
    }
  };

  if (state === 'loading' || state === 'unsupported') return null;

  if (state === 'denied') {
    return (
      <span className="text-xs text-gray-500" title="Enable notifications in your browser settings">
        🔕 Notifications blocked
      </span>
    );
  }

  if (state === 'unavailable') {
    return (
      <span className="text-xs text-gray-500" title="Push notifications not configured on the server">
        🔕 Notifications unavailable
      </span>
    );
  }

  const subscribed = state === 'subscribed';
  return (
    <button
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors disabled:opacity-50
        ${subscribed
          ? 'bg-primary-500/15 text-primary-300 border border-primary-500/30 hover:bg-primary-500/25'
          : 'bg-dark-700 text-gray-300 border border-white/10 hover:bg-dark-600'
        }`}
      title={subscribed ? 'Stop news notifications' : 'Get notified when new news is posted'}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {busy ? '…' : subscribed ? 'Notifications on' : 'Notify me'}
    </button>
  );
}
