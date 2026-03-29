import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { BlogGrid } from '@/components/blog/BlogGrid'
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

        <BlogGrid posts={posts} locale={locale} />
      </main>
      <BottomNav />
    </div>
  )
}
