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
        {item.author && <span className="text-white/30">by {item.author}</span>}
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
        title="Garhwali Culture Library | Blogs & Educational Articles"
        description="Read long-form Garhwali culture blogs and educational articles on Uttarakhand history, traditions, festivals, language, and Himalayan lifestyle."
        path="/culture"
        keywords="Garhwali culture blog, Uttarakhand history articles, Pahadi traditions, Garhwali language preservation, Himalayan culture"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Garhwali Culture Library',
          url: 'https://pahaditube.in/culture',
          description: 'Long-form blogs and educational articles focused on Uttarakhand culture and history.',
          isPartOf: { '@id': 'https://pahaditube.in/#website' },
        }}
      />

      <header className="mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Garhwali Culture Library</h1>
        <p className="text-sm sm:text-base text-white/65 max-w-4xl leading-relaxed">
          This section is built for readers who want depth, not just headlines. You will find original long-form writing on
          Garhwali identity, oral traditions, migration, Uttarakhand history, festivals, and Himalayan social life. Each
          article is structured to support both everyday readers and students preparing cultural research projects.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/50">
          <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">Original Editorial Content</span>
          <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">History + Tradition</span>
          <span className="px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">Language + Community</span>
        </div>
      </header>

      <section className="mb-12">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h2 className="text-2xl font-bold text-amber-100">Culture Blog Posts</h2>
          <span className="text-xs text-white/40">{BLOG_POSTS.length} posts</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {BLOG_POSTS.map((post) => (
            <LongformCard key={post.slug} item={post} type="Culture Blog" />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h2 className="text-2xl font-bold text-amber-100">Educational Articles</h2>
          <span className="text-xs text-white/40">{EDUCATIONAL_ARTICLES.length} articles</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {EDUCATIONAL_ARTICLES.map((article) => (
            <LongformCard key={article.slug} item={article} type="Educational" />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-r from-primary-900/20 to-amber-900/20 p-6 sm:p-7">
        <h2 className="text-xl font-semibold text-white mb-2">Continue Exploring Uttarakhand Stories</h2>
        <p className="text-sm text-white/70 mb-4">
          For oral narratives and hero legends, explore the folk-story archive. For language learning, continue to the Garhwali learning section.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/folk-stories"
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors"
          >
            Read Folk Stories
          </Link>
          <Link
            to="/garhwali-sikha"
            className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/35 text-white text-sm font-semibold transition-colors"
          >
            Learn Garhwali
          </Link>
        </div>
      </section>
    </div>
  );
}
