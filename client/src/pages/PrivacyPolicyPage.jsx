import SEO from '../components/SEO';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: [
      'PahadiTube collects minimal information to provide and improve our services:',
      '• Automatically collected data: When you visit the site we log your anonymised IP address (used only to count unique visitors), browser type, device type, and pages visited.',
      '• Account information: If you sign in with Google, we receive your name, email address, and profile picture from Google OAuth. We do not store passwords.',
      '• Favourites: Videos you save to your Favourites list are stored locally in your browser (localStorage). They are not uploaded to our servers.',
      '• Feedback: If you submit feedback, we store your name, optional email address, and message on our server.',
      '• Push notifications: If you subscribe to notifications, we store your browser push subscription token to send you updates.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'We use the collected information solely to:',
      '• Display personalised or region-relevant content (e.g. trending videos near your city — derived from IP geolocation only).',
      '• Count unique visitors and page opens for analytics purposes.',
      '• Respond to feedback messages you send us.',
      '• Send push notifications you have explicitly subscribed to.',
      '• Improve site performance, fix bugs, and enhance the user experience.',
      'We do not sell, rent, or share your personal data with third parties for marketing purposes.',
    ],
  },
  {
    title: '3. Third-Party Services',
    content: [
      'PahadiTube embeds content from and interacts with the following third-party services. Each has its own privacy policy:',
      '• YouTube (Google LLC) — video embeds and the YouTube Data API. Google\'s privacy policy applies: https://policies.google.com/privacy',
      '• Google Sign-In (Google LLC) — optional authentication. Google\'s privacy policy applies.',
      '• Google AdSense (Google LLC) — we display ads served by Google, which may use cookies and web beacons to serve personalised ads based on your visits to this and other websites.',
      '• ElevenLabs — text-to-speech audio generation for the Ghughuti AI feature.',
      '• ipapi.co — IP-based geolocation to show regional trending content. No personal data is stored by us from this service.',
    ],
  },
  {
    title: '4. Cookies & Local Storage',
    content: [
      'We use the following storage mechanisms:',
      '• localStorage — to store your saved Favourites and theme preference. No data is transmitted to our servers.',
      '• Cookies — Google AdSense may set cookies to serve and measure ads. You can manage cookie preferences in your browser settings.',
      'We do not set first-party tracking cookies.',
    ],
  },
  {
    title: '5. Data Retention',
    content: [
      'Visitor IP addresses are anonymised and retained for up to 90 days for abuse-prevention purposes.',
      'Feedback messages are retained until deleted by an administrator.',
      'Push notification tokens are retained until you unsubscribe.',
      'Google account information is stored only in your browser session and cleared when you sign out.',
    ],
  },
  {
    title: '6. Your Rights',
    content: [
      'You have the right to:',
      '• Access, correct, or delete any personal data we hold about you.',
      '• Withdraw consent to push notifications at any time via your browser settings.',
      '• Opt out of personalised ads by visiting https://www.google.com/settings/ads or by using the AdChoices link in any ad.',
      'To exercise your rights, contact us at info@pahaditube.in.',
    ],
  },
  {
    title: '7. Children\'s Privacy',
    content: [
      'PahadiTube is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.',
    ],
  },
  {
    title: '8. Security',
    content: [
      'We implement industry-standard security measures including HTTPS encryption, HTTP security headers (via Helmet.js), rate limiting, and CORS restrictions to protect your information. However, no method of transmission over the Internet is 100% secure.',
    ],
  },
  {
    title: '9. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of PahadiTube after changes are posted constitutes your acceptance of the revised policy.',
    ],
  },
  {
    title: '10. Contact Us',
    content: [
      'If you have any questions or concerns about this Privacy Policy, please contact:',
      'Email: info@pahaditube.in',
      'PahadiTube — Devbhoomi Uttarakhand, India',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <SEO
        title="Privacy Policy — PahadiTube"
        description="Read PahadiTube's Privacy Policy to understand how we collect, use, and protect your personal information."
        path="/privacy-policy"
        keywords="PahadiTube privacy policy, data protection, cookies, personal information"
      />

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">Privacy Policy</h1>
        <p className="text-sm text-gray-500">
          Last updated: <time dateTime="2026-05-11">11 May 2026</time>
        </p>
        <p className="mt-4 text-gray-400 leading-relaxed">
          PahadiTube (<strong className="text-gray-300">pahaditube.in</strong>) is a free streaming platform celebrating Garhwali and Kumaoni culture from Devbhoomi Uttarakhand. We are committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights.
        </p>
      </div>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-white mb-3 border-l-2 border-primary-500 pl-3">
              {section.title}
            </h2>
            <div className="space-y-2">
              {section.content.map((line, i) => (
                <p key={i} className="text-gray-400 leading-relaxed text-sm">
                  {line}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
