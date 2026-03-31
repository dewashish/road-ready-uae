'use client'

import Link from 'next/link'
import { useDictionary, useLocale } from '@/i18n/DictionaryContext'

const FEATURED_POSTS = [
  {
    slug: 'rta-theory-test-dubai-complete-guide',
    category: 'guide',
    title: 'RTA Theory Test Dubai: Complete 2026 Guide',
    readTime: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpGUMhhvZuBkcV72PpXznP8clDUbSrGaHfR_DNzDpXP8HqnMdQ7daaVUYg9ciKPwC8lYG_sDuiX1WHBR9_xG3ydgtSV1ZEM2XM4r3BSLzO3rUdmf-wsYZ4Ud4zOXNKk4lksglOkjpXuC93Uvc2xe5ImJGQ50EeeVGq7tMrh0ZGlkow7Fc6wn7bAa1wmy3bA5vABHaxPA4vhaid2Xkv-8Mw27SAS1i8LeuaFYdSrs1BGIT6Sh62gQhLcQkpWlA6aGaM0dAJrcnAYBA',
    imageAlt: 'Dubai skyline and road at night',
    shadow: 'neo-shadow-secondary' as const,
    accentColor: 'secondary' as const,
  },
  {
    slug: 'how-to-pass-rta-theory-test-first-time',
    category: 'tips',
    title: 'How to Pass the RTA Theory Test First Time',
    readTime: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjm_hDHf18418PIMG37mKGFbZNpTxhStBht1zomV_8PuqitrTzZzA1ioCHEXC5JXXS-r7cYC3JTk9Pd2amfR6CrpratO9dcE8iuytyktRP2wMNNhsXjkQUD4rJ350eNf8vkJ2z19YSuPqoCCWV0rLvhKk3Xv83H2TIaQVY3torv8DAKrl_RwgpI6nx63l0VQ25jxwb8goCl3Lgnxg31gg8M3pPYUZZmsoUnzFl8uX873GpE7ABl9ged5CyNqaHEw5wKqFBfvobKcY',
    imageAlt: 'Car steering wheel with digital dashboard',
    shadow: 'neo-shadow-tertiary' as const,
    accentColor: 'tertiary' as const,
  },
  {
    slug: 'dubai-driving-license-cost-2026',
    category: 'cost',
    title: 'Dubai Driving License Cost 2026: Fee Breakdown',
    readTime: 10,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF6t3fjRXlWcRFZkj6K9_mUqjX6DMe_p9VYD4asWOqzatqrwq7Z1gzc5Q78Ozi_Bq_ITwlcPxwL8-8pxpeDVJecKC8cQLzy-RJS3_b7a3jbGNcUnf3yrha8Nd0zkDyQmfes5ftPCd8B9Wf1SSzqHK8B2GDZx1sbiulcvK9nHsyWJmX1O5p2GuapJ1yD42eBbDtNZk_nY3XyUuwl5SWSLub2wiGJIHa5BRsr69Ls8xKeZltl9HmcMxiH_EkgnqaP-Xnxr5OddYwCMM',
    imageAlt: 'Currency coins and car keys',
    shadow: 'neo-shadow-secondary' as const,
    accentColor: 'secondary' as const,
  },
]

export function BlogSection() {
  const locale = useLocale()
  const dict = useDictionary()
  const homeDict = (dict as any).home ?? {}

  return (
    <section className="mt-12 mb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div className="space-y-2">
          <h3 className="font-headline font-black text-4xl sm:text-5xl md:text-7xl tracking-tighter uppercase leading-none">
            <span className="block" style={{ WebkitTextStroke: '1.5px #f5ce53', color: 'transparent' }}>
              {homeDict.fromTheBlog ?? 'From the'}
            </span>
            <span className="text-secondary">{homeDict.blog ?? 'Blog'}</span>
          </h3>
          <p className="font-label text-tertiary tracking-widest text-xs sm:text-sm font-bold uppercase">
            {homeDict.blogSubtitle ?? 'Tips, guides & everything you need to pass.'}
          </p>
        </div>
        <Link
          href={`/${locale}/blog`}
          className="neo-push flex items-center gap-2 bg-secondary text-surface-container-lowest py-3 sm:py-4 px-6 sm:px-8 font-label font-black text-xs sm:text-sm tracking-widest border-2 border-surface-container-lowest neo-shadow transition-all duration-75 group self-start sm:self-auto"
        >
          {homeDict.viewAllArticles ?? 'View All Articles'}
          <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform" style={{ fontSize: 18 }}>
            arrow_forward
          </span>
        </Link>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        {FEATURED_POSTS.map((post) => {
          const badgeClass = post.accentColor === 'secondary'
            ? 'bg-secondary text-surface-container-lowest'
            : 'bg-tertiary text-surface-container-lowest'
          const hoverTextClass = post.accentColor === 'secondary'
            ? 'group-hover:text-secondary'
            : 'group-hover:text-tertiary'
          const arrowClass = post.accentColor === 'secondary'
            ? 'text-secondary'
            : 'text-tertiary'

          return (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className={`block bg-surface-container-high border-2 border-surface-container-lowest ${post.shadow} group cursor-pointer hover:-translate-y-1 transition-transform duration-200`}
            >
              {/* Image */}
              <div className="aspect-video relative overflow-hidden bg-surface-container">
                <img
                  alt={post.imageAlt}
                  src={post.image}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
                <div className={`absolute top-3 start-3 sm:top-4 sm:start-4 px-3 py-1 font-label font-black text-xs tracking-tight ${badgeClass}`}>
                  {post.category.toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-4">
                <h4 className={`font-headline font-bold text-lg sm:text-2xl leading-tight text-on-surface ${hoverTextClass} transition-colors`}>
                  {post.title}
                </h4>
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t-2 border-surface-container-low">
                  <div className="flex items-center gap-2 text-on-surface-variant font-label text-xs font-bold">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
                    {post.readTime} {homeDict.minRead ?? 'MIN READ'}
                  </div>
                  <span className={`material-symbols-outlined ${arrowClass} opacity-0 group-hover:opacity-100 transition-opacity`} style={{ fontSize: 20 }}>
                    north_east
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Mobile CTA (below cards) */}
      <div className="mt-6 sm:hidden">
        <Link
          href={`/${locale}/blog`}
          className="neo-push flex items-center justify-center gap-2 w-full py-3 bg-secondary text-surface-container-lowest border-2 border-surface-container-lowest neo-shadow font-label text-sm font-black tracking-widest"
        >
          {homeDict.viewAllArticles ?? 'View All Articles'}
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
        </Link>
      </div>
    </section>
  )
}
