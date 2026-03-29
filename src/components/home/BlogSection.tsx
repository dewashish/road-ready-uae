'use client'

import Link from 'next/link'
import { NeoCard } from '@/components/ui/NeoCard'
import { useLocale } from '@/i18n/DictionaryContext'

const FEATURED_POSTS = [
  {
    slug: 'rta-theory-test-dubai-complete-guide',
    category: 'guide',
    title: 'RTA Theory Test Dubai: The Complete 2026 Guide',
    readTime: 15,
  },
  {
    slug: 'how-to-pass-rta-theory-test-first-time',
    category: 'tips',
    title: 'How to Pass the RTA Theory Test First Time',
    readTime: 12,
  },
  {
    slug: 'dubai-driving-license-cost-2026',
    category: 'cost',
    title: 'Dubai Driving License Cost 2026: Fee Breakdown',
    readTime: 10,
  },
]

export function BlogSection() {
  const locale = useLocale()

  return (
    <section className="mt-10 mb-2">
      {/* Header row */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h3 className="font-headline text-xl sm:text-2xl font-bold uppercase tracking-wider leading-tight">
            <span style={{ WebkitTextStroke: '1px #f5ce53', color: 'transparent', paintOrder: 'stroke fill' }}>
              From the
            </span>{' '}
            <span className="text-secondary">Blog</span>
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant font-body mt-1">
            Tips, guides & everything you need to pass.
          </p>
        </div>
        <Link
          href={`/${locale}/blog`}
          className="neo-push hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary border-2 border-surface-container-lowest neo-shadow-secondary font-label text-xs font-bold uppercase tracking-wider flex-shrink-0"
        >
          View All
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
        </Link>
      </div>

      {/* Card grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {FEATURED_POSTS.map((post, i) => {
          const shadow = (i % 2 === 0 ? 'secondary' : 'tertiary') as 'secondary' | 'tertiary'
          const badgeClass = i % 2 === 0
            ? 'bg-secondary text-on-secondary'
            : 'bg-tertiary text-on-tertiary'
          const readColor = i % 2 === 0 ? 'text-secondary' : 'text-tertiary'

          return (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="block neo-hover">
              <NeoCard level={2} shadow={shadow} className="h-full flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-label font-bold uppercase tracking-wider border-2 border-surface-container-lowest ${badgeClass}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-on-surface-variant font-body">
                    {post.readTime} min
                  </span>
                </div>
                <h4 className="font-headline text-sm sm:text-base font-bold text-primary leading-tight flex-1">
                  {post.title}
                </h4>
                <div className="flex items-center justify-end pt-2 border-t-2 border-surface-container-lowest">
                  <span className={`flex items-center gap-1 text-xs font-label font-bold ${readColor}`}>
                    Read
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                  </span>
                </div>
              </NeoCard>
            </Link>
          )
        })}
      </div>

      {/* Mobile CTA */}
      <div className="mt-4 sm:hidden">
        <Link
          href={`/${locale}/blog`}
          className="neo-push flex items-center justify-center gap-2 w-full px-4 py-3 bg-secondary text-on-secondary border-2 border-surface-container-lowest neo-shadow-secondary font-label text-sm font-bold uppercase tracking-wider"
        >
          View All Articles
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
        </Link>
      </div>
    </section>
  )
}
