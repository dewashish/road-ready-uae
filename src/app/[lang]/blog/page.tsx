import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { BlogCard } from '@/components/blog/BlogCard'
import { getAllPosts } from '@/lib/blog'
import { locales, type Locale } from '@/i18n/config'

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export const metadata: Metadata = {
  title: 'Blog – Driving Tips, Guides & Test Prep',
  description:
    'Expert guides, study tips, and everything you need to pass your UAE driving theory test. Updated for 2026.',
  alternates: {
    canonical: '/en/blog',
    languages: Object.fromEntries(locales.map((l) => [l, `/${l}/blog`])),
  },
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const posts = getAllPosts()

  const categories = ['all', ...new Set(posts.map((p) => p.category))] as const

  return (
    <div className="min-h-dvh bg-background pb-20 sm:pb-0">
      <Header />
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="font-headline text-2xl sm:text-3xl font-bold uppercase tracking-wider">
            <span className="text-primary">Driving </span>
            <span className="text-secondary">Blog</span>
          </h1>
          <p className="text-on-surface-variant font-body mt-2">
            Expert guides, study tips, and everything you need to pass your UAE theory test.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1.5 text-xs font-label font-bold uppercase tracking-wider border-2 border-surface-container-lowest bg-surface-container text-on-surface-variant cursor-default"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Post grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} locale={locale} index={i} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-outline mb-4" style={{ fontSize: 48 }}>article</span>
            <p className="font-headline text-lg font-bold">No posts yet</p>
            <p className="text-sm mt-1">Check back soon for driving tips and guides.</p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
