import SEO from '../components/SEO';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: [
      'By accessing or using PahadiTube (pahaditube.in), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, please do not use the platform.',
      'PahadiTube is a free, non-commercial cultural platform dedicated to celebrating the heritage, art, music, and traditions of Devbhoomi Uttarakhand (Garhwal & Kumaon regions).',
    ],
  },
  {
    title: '2. Description of Service',
    content: [
      'PahadiTube provides the following services free of charge:',
      '• Curated YouTube video content: Garhwali/Kumaoni movies, songs, comedy, devotional music, folk dances, and cultural programs.',
      '• Original editorial content: folk stories (in Garhwali/Hindi), regional news, government job listings, Pahadi recipes, traditional attire guides, and festival information.',
      '• AI-powered Garhwali language chatbot (Ghughuti AI) and Garhwali language learning tools.',
      '• Community features: feedback submission, art gallery, and Pahadi Byo (matchmaking).',
      'All video content is embedded from YouTube and is subject to YouTube\'s Terms of Service (https://www.youtube.com/t/terms).',
    ],
  },
  {
    title: '3. User Conduct',
    content: [
      'When using PahadiTube, you agree not to:',
      '• Upload, share, or transmit any content that is unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable.',
      '• Attempt to gain unauthorised access to our servers, databases, or any part of the platform infrastructure.',
      '• Use automated scripts, bots, or scrapers to access or collect data from the platform without written permission.',
      '• Impersonate any person or entity, or misrepresent your affiliation with a person or entity.',
      '• Interfere with or disrupt the service, servers, or networks connected to the platform.',
      '• Use the platform for any commercial purpose or to solicit business without our prior written consent.',
    ],
  },
  {
    title: '4. Intellectual Property',
    content: [
      'The PahadiTube brand, logo, original editorial content (folk stories, recipe guides, cultural articles), and site design are the intellectual property of PahadiTube and its creator.',
      'Video content embedded from YouTube remains the property of its respective creators and is governed by YouTube\'s Terms of Service.',
      'You may share links to PahadiTube pages freely. However, you may not reproduce, distribute, or create derivative works from our original content without written permission.',
    ],
  },
  {
    title: '5. User-Generated Content',
    content: [
      'By submitting feedback, art gallery entries, Pahadi Byo profiles, or any other user-generated content, you grant PahadiTube a non-exclusive, royalty-free licence to display and use such content on the platform.',
      'You retain ownership of content you submit but represent that you have the right to share it and that it does not violate any third-party rights.',
      'We reserve the right to remove any user-generated content that violates these Terms or is deemed inappropriate.',
    ],
  },
  {
    title: '6. Third-Party Services & Links',
    content: [
      'PahadiTube integrates with third-party services including YouTube, Google Sign-In, Google AdSense, and ElevenLabs. Your use of these services is subject to their respective terms and privacy policies.',
      'We may display advertisements served by Google AdSense. Ad content is determined by Google and not by PahadiTube.',
      'External links on the platform are provided for convenience. We are not responsible for the content, accuracy, or practices of external websites.',
    ],
  },
  {
    title: '7. Disclaimer of Warranties',
    content: [
      'PahadiTube is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied.',
      'We do not guarantee that the service will be uninterrupted, error-free, or free of harmful components.',
      'We make no guarantees about the accuracy, reliability, or completeness of content from third-party sources (YouTube videos, news feeds, job listings).',
      'Government job listings and Sarkaari Yojana information are provided for reference only. Always verify with official government sources.',
    ],
  },
  {
    title: '8. Limitation of Liability',
    content: [
      'To the fullest extent permitted by law, PahadiTube and its creator shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.',
      'This includes but is not limited to: loss of data, loss of revenue, or reliance on any information obtained through the platform.',
    ],
  },
  {
    title: '9. Account Termination',
    content: [
      'If you sign in with Google, we may suspend or terminate your access to authenticated features (such as Ghughuti AI) if you violate these Terms.',
      'We reserve the right to block access from specific IP addresses that engage in abusive behaviour or automated scraping.',
    ],
  },
  {
    title: '10. Changes to Terms',
    content: [
      'We may update these Terms from time to time. The "Last updated" date at the top of this page will reflect the most recent revision.',
      'Continued use of PahadiTube after any changes constitutes acceptance of the new Terms.',
      'For significant changes, we will make reasonable efforts to notify users via the platform.',
    ],
  },
  {
    title: '11. Governing Law',
    content: [
      'These Terms shall be governed by and construed in accordance with the laws of India.',
      'Any disputes arising from these Terms shall be subject to the jurisdiction of courts in Dehradun, Uttarakhand, India.',
    ],
  },
  {
    title: '12. Contact',
    content: [
      'If you have any questions about these Terms of Service, please contact us:',
      '• Email: info@pahaditube.in',
      '• Website: https://pahaditube.in/feedback',
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <SEO
        title="Terms of Service - PahadiTube"
        description="Terms of Service for PahadiTube — rules and guidelines for using the Garhwali and Pahadi cultural entertainment platform."
        path="/terms-of-service"
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-8">Last updated: 26 May 2026</p>

        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-white/90 mb-3">{section.title}</h2>
              <div className="space-y-2">
                {section.content.map((para, i) => (
                  <p key={i} className="text-white/60 text-sm leading-relaxed">{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
