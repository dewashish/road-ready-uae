import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { BlogLayout } from '@/components/blog/BlogLayout'
import { getAllSlugs, getPostBySlug, getRelatedPosts } from '@/lib/blog'
import { locales, ogLocaleMap, type Locale } from '@/i18n/config'

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const baseUrl = 'https://www.roadreadyuae.com'

  return {
    title: post.seo.title,
    description: post.seo.description,
    keywords: post.seo.keywords,
    alternates: {
      canonical: `/${lang}/blog/${slug}`,
      languages: {
        'x-default': `/en/blog/${slug}`,
        ...Object.fromEntries(
          locales.map((l) => [l, `/${l}/blog/${slug}`])
        ),
      },
    },
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      url: `${baseUrl}/${lang}/blog/${slug}`,
      siteName: 'Road Ready UAE',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      locale: ogLocaleMap[lang as Locale] ?? 'en_AE',
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocaleMap[l]),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.title,
      description: post.seo.description,
    },
  }
}

function BlogPostingSchema({ post, locale }: { post: NonNullable<ReturnType<typeof getPostBySlug>>; locale: string }) {
  const content = post.content[locale as 'en' | 'ar'] ?? post.content.en
  const baseUrl = 'https://www.roadreadyuae.com'

  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: content.title,
    description: post.seo.description,
    author: { '@type': 'Organization', name: post.author, url: baseUrl },
    publisher: { '@type': 'Organization', name: 'Road Ready UAE', url: baseUrl },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: `${baseUrl}/${locale}/blog/${post.slug}`,
    keywords: post.seo.keywords.join(', '),
    wordCount: post.content.en.sections.reduce((sum, s) => sum + s.body.split(/\s+/).length, 0),
    inLanguage: locale,
  }

  const faqPage = post.faq.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/${locale}/blog` },
      { '@type': 'ListItem', position: 3, name: content.title, item: `${baseUrl}/${locale}/blog/${post.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }} />
      {faqPage && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  )
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const locale = lang as Locale
  const post = getPostBySlug(slug)

  if (!post) notFound()

  const relatedPosts = getRelatedPosts(post)

  return (
    <div className="min-h-dvh bg-background pb-20 sm:pb-0">
      <BlogPostingSchema post={post} locale={locale} />
      <Header showBack backHref="/blog" />
      <main id="main-content">
        <BlogLayout post={post} locale={locale} relatedPosts={relatedPosts} />
      </main>
      <BottomNav />
    </div>
  )
}
