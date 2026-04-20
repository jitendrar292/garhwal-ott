# Pahadi Intro Sound

Drop a short audio clip here named **`intro.mp3`** (≤ 5 seconds, ideally 60–150 KB).

The app automatically plays it once per browser session when the site / installed PWA opens. If autoplay is blocked by the browser, it plays on the user's first tap / click.

## Recommended specs
- Format: `mp3` (most compatible) — `ogg` / `m4a` also work if you change the path in `client/src/components/IntroSound.jsx`
- Duration: 3–5 seconds (component caps playback at 5 s anyway)
- Bitrate: 96–128 kbps mono is plenty
- Loudness: keep peaks around −6 dB so it isn't startling

## Where to get a Garhwali / Pahadi flute or dhol clip
- Royalty-free Indian folk loops on Pixabay / Freesound (search "bansuri", "dhol", "pahadi flute")
- Or record a 3-sec snippet from a Garhwali song you own / have rights to

Once you put `intro.mp3` here and redeploy, it will start playing automatically.
