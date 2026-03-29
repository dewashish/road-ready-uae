'use client'

import { useState } from 'react'
import { BlogCard } from './BlogCard'
import type { BlogPost } from '@/types/blog'

interface BlogGridProps {
  posts: BlogPost[]
  locale: string
}

export function BlogGrid({ posts, locale }: BlogGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = ['all', ...new Set(posts.map((p) => p.category))]

  const filtered = activeCategory === 'all'
    ? posts
    : posts.filter((p) => p.category === activeCategory)

  return (
    <>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`neo-push px-3 py-1.5 text-xs font-label font-bold uppercase tracking-wider border-2 transition-all ${
                isActive
                  ? 'bg-secondary text-surface-container-lowest border-secondary neo-shadow-secondary'
                  : 'bg-surface-container text-on-surface-variant border-surface-container-lowest hover:border-secondary hover:text-secondary'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Post grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post, i) => (
          <BlogCard key={post.slug} post={post} locale={locale} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-outline mb-4" style={{ fontSize: 48 }}>article</span>
          <p className="font-headline text-lg font-bold">No posts in this category</p>
          <p className="text-sm mt-1">Try selecting a different category.</p>
        </div>
      )}
    </>
  )
}
