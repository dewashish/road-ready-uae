import Link from 'next/link'
import { NeoCard } from '@/components/ui/NeoCard'
import type { BlogPost } from '@/types/blog'

interface BlogCardProps {
  post: BlogPost
  locale: string
  index: number
}

const categoryColors: Record<string, string> = {
  guide: 'bg-secondary text-on-secondary',
  tips: 'bg-tertiary text-on-tertiary',
  signs: 'bg-secondary text-on-secondary',
  rules: 'bg-tertiary text-on-tertiary',
  cost: 'bg-secondary text-on-secondary',
  expats: 'bg-tertiary text-on-tertiary',
}

export function BlogCard({ post, locale, index }: BlogCardProps) {
  const shadow = index % 2 === 0 ? 'secondary' : 'tertiary' as const
  const content = post.content[locale as 'en' | 'ar'] ?? post.content.en

  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="block neo-hover">
      <NeoCard level={2} shadow={shadow} className="h-full flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-[10px] font-label font-bold uppercase tracking-wider border-2 border-surface-container-lowest ${categoryColors[post.category] ?? 'bg-secondary text-on-secondary'}`}>
            {post.category}
          </span>
          <span className="text-xs text-on-surface-variant font-body">
            {post.readTimeMinutes} min read
          </span>
        </div>
        <h3 className="font-headline text-base sm:text-lg font-bold text-primary leading-tight">
          {content.title}
        </h3>
        <p className="text-sm text-on-surface-variant font-body line-clamp-2 flex-1">
          {post.seo.description}
        </p>
        <div className="flex items-center justify-between pt-2 border-t-2 border-surface-container-lowest">
          <span className="text-xs text-on-surface-variant font-label">
            {new Date(post.updatedAt).toLocaleDateString('en-AE', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1 text-xs font-label font-bold text-secondary">
            Read
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
          </span>
        </div>
      </NeoCard>
    </Link>
  )
}
