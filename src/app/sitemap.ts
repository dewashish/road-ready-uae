import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { getAllPosts } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.roadreadyuae.com'

  const paths = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/quiz/B', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/quiz/A', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/quiz/C', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/quiz/D', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/quiz/E', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/history', priority: 0.5, changeFrequency: 'daily' as const },
    { path: '/progress', priority: 0.5, changeFrequency: 'daily' as const },
  ]

  const staticEntries = paths.flatMap(({ path, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}${path}`])
        ),
      },
    }))
  )

  // Blog post entries
  const blogPosts = getAllPosts()
  const blogEntries = blogPosts.flatMap((post) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}/blog/${post.slug}`])
        ),
      },
    }))
  )

  return [...staticEntries, ...blogEntries]
}
