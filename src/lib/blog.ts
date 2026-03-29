import type { BlogPost } from '@/types/blog'

// Explicitly import all blog posts — add new posts here
import post1 from '@/data/blog/rta-theory-test-dubai-complete-guide.json'
import post2 from '@/data/blog/abu-dhabi-driving-theory-test-guide.json'
import post3 from '@/data/blog/uae-road-signs-complete-guide.json'
import post4 from '@/data/blog/how-to-pass-rta-theory-test-first-time.json'
import post5 from '@/data/blog/rta-theory-test-questions-answers-2026.json'
import post6 from '@/data/blog/dubai-driving-license-cost-2026.json'
import post7 from '@/data/blog/uae-traffic-fines-black-points-2026.json'
import post8 from '@/data/blog/motorcycle-theory-test-uae-guide.json'
import post9 from '@/data/blog/rta-theory-test-hindi-urdu-guide.json'
import post10 from '@/data/blog/uae-driving-test-tips-expats.json'

const allPostsRaw: BlogPost[] = [
  post1, post2, post3, post4, post5,
  post6, post7, post8, post9, post10,
] as unknown as BlogPost[]

const allPosts = allPostsRaw.sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
)

export function getAllPosts(): BlogPost[] {
  return allPosts
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug)
}

export function getPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return allPosts.filter((p) => p.category === category)
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return allPosts.filter((p) => post.relatedSlugs.includes(p.slug))
}

export function getAllSlugs(): string[] {
  return allPosts.map((p) => p.slug)
}
