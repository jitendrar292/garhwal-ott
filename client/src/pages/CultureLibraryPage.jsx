import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BLOG_POSTS, EDUCATIONAL_ARTICLES } from '../data/cultureLibrary';

function LongformCard({ item, type }) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
        <span className="px-2 py-1 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30">
          {type}
        </span>
        <span className="text-white/40">{item.readTime}</span>
        {item.author && <span className="text-white/30">लेखक: {item.author}</span>}
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
      <p className="text-sm text-white/60 leading-relaxed mb-5">{item.excerpt}</p>

      <div className="space-y-4">
        {item.sections.map((section) => (
          <section key={section.heading}>
            <h4 className="text-sm font-semibold text-amber-200 mb-1.5">{section.heading}</h4>
            <p className="text-sm text-white/70 leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}

export default function CultureLibraryPage() {
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <SEO
        title="गढ़वाली सांस्कृतिक पुस्तकालय | ब्लॉग और शैक्षणिक लेख"
        description="उत्तराखंड के इतिहास, परंपराओं, त्योहारों, भाषा और हिमालयी जीवन-शैली पर विस्तृत गढ़वाली सांस्कृतिक ब्लॉग और शैक्षणिक लेख पढ़ें।"
        path="/culture"
        keywords="गढ़वाली संस्कृति ब्लॉग, उत्तराखंड इतिहास लेख, पहाड़ी परंपराएँ, गढ़वाली भाषा संरक्षण, हिमालयी संस्कृति, Garhwali culture blog, Uttarakhand history articles"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'गढ़वाली सांस्कृतिक पुस्तकालय',
          url: 'https://pahaditube.in/culture',
          description: 'उत्तराखंड की संस्कृति और इतिहास पर केंद्रित विस्तृत ब्लॉग और शैक्षणिक लेख।',
          isPartOf: { '@id': 'https://pahaditube.in/#website' },
        }}
      />

      <header className="mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">गढ़वाली सांस्कृतिक पुस्तकालय</h1>
        <p className="text-sm sm:text-base text-white/65 max-w-4xl leading-relaxed">
          यह विभाग उन पाठकों के लिए है जो केवल सुर्ख़ियाँ नहीं, गहराई चाहते हैं। यहाँ आपको गढ़वाली पहचान, मौखिक परंपराओं, पलायन, उत्तराखंड
          के इतिहास, त्योहारों और हिमालयी सामाजिक जीवन पर मौलिक विस्तृत लेखन मिलेगा। हर लेख इस तरह से रचा गया है कि यह आम पाठकों और
          सांस्कृतिक शोध कर रहे विद्यार्थियों — दोनों के काम आ सके।
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/50">
          <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">मौलिक सम्पादकीय लेखन</span>
          <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">इतिहास + परंपरा</span>
          <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">भाषा + समुदाय</span>
        </div>
      </header>

      <section className="mb-12">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h2 className="text-2xl font-bold text-amber-100">सांस्कृतिक ब्लॉग</h2>
          <span className="text-xs text-white/40">{BLOG_POSTS.length} ब्लॉग</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {BLOG_POSTS.map((post) => (
            <LongformCard key={post.slug} item={post} type="सांस्कृतिक ब्लॉग" />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h2 className="text-2xl font-bold text-amber-100">शैक्षणिक लेख</h2>
          <span className="text-xs text-white/40">{EDUCATIONAL_ARTICLES.length} लेख</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {EDUCATIONAL_ARTICLES.map((article) => (
            <LongformCard key={article.slug} item={article} type="शैक्षणिक" />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-r from-primary-900/20 to-amber-900/20 p-6 sm:p-7">
        <h2 className="text-xl font-semibold text-white mb-2">उत्तराखंड की कहानियाँ आगे पढ़ें</h2>
        <p className="text-sm text-white/70 mb-4">
          मौखिक कथाओं और वीर-गाथाओं के लिए लोक-कथा संग्रह देखें। भाषा सीखने के लिए गढ़वाली सीखा विभाग में जाएँ।
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/folk-stories"
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors"
          >
            लोक-कथाएँ पढ़ें
          </Link>
          <Link
            to="/garhwali-sikha"
            className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/35 text-white text-sm font-semibold transition-colors"
          >
            गढ़वाली सीखें
          </Link>
        </div>
      </section>
    </div>
  );
}
