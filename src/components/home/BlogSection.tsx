'use client'

import Link from 'next/link'
import { useLocale } from '@/i18n/DictionaryContext'

const FEATURED_POSTS = [
  {
    slug: 'rta-theory-test-dubai-complete-guide',
    category: 'guide',
    title: 'RTA Theory Test Dubai: Complete 2026 Guide',
    readTime: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpFuPJfXB31gUm5BkK_KKcEAZpezJS9wscImgndJBFLQZp3ORGqUGoKVPCSYDklKlox7TCQqEhLE4b89CmM4fRjIeDeV9lhQ4cW9mqXgNwCE2RQXBeBjwJ83Ewp3PB3qqlt3Wv6og6s89oMPvPqSOjPClMO6akVqigPqmE2PzSP2OK_KgeRfqFLwze6gNiEYK_cpNXETmfysn9XPUzqxR8j3I7NvqByJ9L5qyWvtYI3QM-rsN2_-Ln-EowtNZtEehcOwoxU37juKs',
    imageAlt: 'Dubai Sheikh Zayed Road at night with car light trails',
    shadow: 'neo-shadow-secondary' as const,
    accentColor: 'secondary' as const,
  },
  {
    slug: 'how-to-pass-rta-theory-test-first-time',
    category: 'tips',
    title: 'How to Pass the RTA Theory Test First Time',
    readTime: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-YvvVhSUhZeLWbc7qrByMJFAdnD1UsPh7RWCIwoOk2J0ePQXxd6UZTcmkhrBca_tDItljXPKUUt9m_V60yrYB2XgIv5BBkA-mitI2GA1Y7cXAeu1IUlQx_ePriuw3LuiLkJCdtZyUXK_WHuBUuIqzEtJ_H-nusuhlJoUgxwskKZYXPFrHw6H3wwW_oxyHi__O1Lnplj0tV_AU7XtxHuuU7d52AbCW5l_XMdHBE87Bw-zAxDgVgvTx3QzPM3Q_mWJYERqA8LxA6vQ',
    imageAlt: 'Person studying for driving test at desk with laptop',
    shadow: 'neo-shadow-tertiary' as const,
    accentColor: 'tertiary' as const,
  },
  {
    slug: 'dubai-driving-license-cost-2026',
    category: 'cost',
    title: 'Dubai Driving License Cost 2026: Fee Breakdown',
    readTime: 10,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTZyDlkxIsxhV8Mw-gD4Gr_70J3ivYjm8dPPymF5bfhhSnqxkObIF1yQ0e9qcQbF8AtqVY08BY2jEuNGqH5AA8azKY6WelzqrNLnKLeK1Kb4e0maHNi3VexEpfiQkkVg-sBg9jT4ahJDjztjTKQRw9yRTOSyrifJXYbbeOBlyfJQz7yndPHvbIfRyo4-UBwte11A60dzUNl5j4OEeXSfRtoqzfWyAANVHMLC0k7pJfS7DSHyOMowkBpfAZDnSQUGQng2aatV2pAL4',
    imageAlt: 'UAE Dirham banknotes with car keys and license',
    shadow: 'neo-shadow-secondary' as const,
    accentColor: 'secondary' as const,
  },
]

export function BlogSection() {
  const locale = useLocale()

  return (
    <section className="mt-12 mb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div className="space-y-2">
          <h3 className="font-headline font-black text-4xl sm:text-5xl md:text-7xl tracking-tighter uppercase leading-none">
            <span className="block" style={{ WebkitTextStroke: '1.5px #f5ce53', color: 'transparent' }}>
              From the
            </span>
            <span className="text-secondary">Blog</span>
          </h3>
          <p className="font-label text-tertiary tracking-widest text-xs sm:text-sm font-bold uppercase">
            Tips, guides & everything you need to pass.
          </p>
        </div>
        <Link
          href={`/${locale}/blog`}
          className="neo-push flex items-center gap-2 bg-secondary text-surface-container-lowest py-3 sm:py-4 px-6 sm:px-8 font-label font-black text-xs sm:text-sm tracking-widest border-2 border-surface-container-lowest neo-shadow transition-all duration-75 group self-start sm:self-auto"
        >
          View All Articles
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
                    {post.readTime} MIN READ
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
          View All Articles
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
        </Link>
      </div>
    </section>
  )
}
