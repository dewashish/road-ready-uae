import Link from 'next/link'
import { NeoCard } from '@/components/ui/NeoCard'
import { NeoButton } from '@/components/ui/NeoButton'
import { MobileTOC, DesktopTOC } from './TableOfContents'
import type { BlogPost, BlogContentLocale } from '@/types/blog'

interface BlogLayoutProps {
  post: BlogPost
  locale: string
  relatedPosts: BlogPost[]
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function BlogLayout({ post, locale, relatedPosts }: BlogLayoutProps) {
  const content: BlogContentLocale = post.content[locale as 'en' | 'ar'] ?? post.content.en
  const tocItems = content.sections.map((s) => ({
    id: slugify(s.heading),
    text: s.heading,
  }))
  if (post.faq.length > 0) {
    tocItems.push({ id: 'faq', text: 'Frequently Asked Questions' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-label text-on-surface-variant mb-6 uppercase tracking-wider" aria-label="Breadcrumb">
        <Link href={`/${locale}`} className="hover:text-secondary transition-colors">Home</Link>
        <span className="text-outline">/</span>
        <Link href={`/${locale}/blog`} className="hover:text-secondary transition-colors">Blog</Link>
        <span className="text-outline">/</span>
        <span className="text-primary truncate max-w-[200px] sm:max-w-none">{content.title}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-10 items-start">
        {/* Main content */}
        <article className="min-w-0">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-0.5 text-[10px] font-label font-bold uppercase tracking-wider border-2 border-surface-container-lowest bg-secondary text-on-secondary">
                {post.category}
              </span>
              <span className="text-xs text-on-surface-variant font-label">
                {post.readTimeMinutes} min read
              </span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-primary leading-tight mb-4">
              {content.title}
            </h1>
            {content.subtitle && (
              <p className="text-lg text-on-surface-variant font-body mb-4">{content.subtitle}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-on-surface-variant font-label">
              <span>By {post.author}</span>
              <span className="text-outline">|</span>
              <span>Updated {new Date(post.updatedAt).toLocaleDateString('en-AE', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </header>

          {/* Mobile TOC */}
          <MobileTOC items={tocItems} />

          {/* Article sections */}
          <div className="blog-prose">
            {content.sections.map((section) => (
              <section key={section.heading} id={slugify(section.heading)} className="mb-8 scroll-mt-24">
                <h2 className="font-headline text-xl sm:text-2xl font-bold text-primary mb-4 border-s-4 border-secondary ps-4">
                  {section.heading}
                </h2>
                <div
                  className="font-body text-on-surface-variant leading-relaxed space-y-4 text-[15px]"
                  dangerouslySetInnerHTML={{ __html: section.body }}
                />
                {section.cta && (
                  <div className="mt-4">
                    <Link href={`/${locale}${section.cta.href}`}>
                      <NeoButton variant="secondary" icon="play_arrow">
                        {section.cta.text}
                      </NeoButton>
                    </Link>
                  </div>
                )}
              </section>
            ))}

            {/* FAQ Section */}
            {post.faq.length > 0 && (
              <section id="faq" className="mb-8 scroll-mt-24">
                <h2 className="font-headline text-xl sm:text-2xl font-bold text-primary mb-6 border-s-4 border-tertiary ps-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {post.faq.map((item, i) => (
                    <NeoCard key={i} level={1} shadow={i % 2 === 0 ? 'secondary' : 'tertiary'}>
                      <h3 className="font-headline text-base font-bold text-primary mb-2">{item.q}</h3>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed">{item.a}</p>
                    </NeoCard>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Practice CTA */}
          {post.relatedQuizModules.length > 0 && (
            <NeoCard level={2} shadow="secondary" className="my-8">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-secondary/20 border-2 border-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: 24 }}>quiz</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline text-base font-bold text-secondary">Practice These Topics</h3>
                  <p className="text-sm text-on-surface-variant">Test your knowledge with real exam-style questions.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {post.relatedQuizModules.map((mod) => (
                  <Link key={mod} href={`/${locale}/quiz/B/${mod}`}>
                    <NeoButton variant="tertiary" size="sm" icon="play_arrow">
                      {mod.replace(/-/g, ' ')}
                    </NeoButton>
                  </Link>
                ))}
              </div>
            </NeoCard>
          )}

          {/* Share buttons */}
          <div className="flex items-center gap-3 py-6 border-t-2 border-surface-container-lowest">
            <span className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">Share:</span>
            <a
              href={`https://twitter.com/intent/tweet?url=https://www.roadreadyuae.com/${locale}/blog/${post.slug}&text=${encodeURIComponent(post.seo.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-push w-10 h-10 flex items-center justify-center bg-surface-container border-2 border-surface-container-lowest neo-shadow hover:border-secondary transition-colors"
              aria-label="Share on X/Twitter"
            >
              <span className="font-headline text-sm font-bold text-primary">X</span>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.seo.title + ' https://www.roadreadyuae.com/' + locale + '/blog/' + post.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-push w-10 h-10 flex items-center justify-center bg-surface-container border-2 border-surface-container-lowest neo-shadow hover:border-success transition-colors"
              aria-label="Share on WhatsApp"
            >
              <span className="material-symbols-outlined text-success" style={{ fontSize: 20 }}>chat</span>
            </a>
          </div>
        </article>

        {/* Desktop TOC sidebar */}
        <DesktopTOC items={tocItems} />
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-12 pt-8 border-t-2 border-surface-container-lowest">
          <h2 className="font-headline text-xl font-bold text-primary uppercase tracking-wider mb-6">Related Articles</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related, i) => {
              const relContent = related.content[locale as 'en' | 'ar'] ?? related.content.en
              return (
                <Link key={related.slug} href={`/${locale}/blog/${related.slug}`} className="block neo-hover">
                  <NeoCard level={2} shadow={i % 2 === 0 ? 'secondary' : 'tertiary'}>
                    <h3 className="font-headline text-base font-bold text-primary mb-2">{relContent.title}</h3>
                    <p className="text-sm text-on-surface-variant line-clamp-2">{related.seo.description}</p>
                  </NeoCard>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
