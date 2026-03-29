import Link from 'next/link'
import type { BlogPost } from '@/types/blog'

interface BlogCardProps {
  post: BlogPost
  locale: string
  index: number
}

const categoryBadge: Record<string, { bg: string; hover: string }> = {
  guide: { bg: 'bg-secondary text-surface-container-lowest', hover: 'group-hover:text-secondary' },
  tips: { bg: 'bg-tertiary text-surface-container-lowest', hover: 'group-hover:text-tertiary' },
  signs: { bg: 'bg-secondary text-surface-container-lowest', hover: 'group-hover:text-secondary' },
  rules: { bg: 'bg-tertiary text-surface-container-lowest', hover: 'group-hover:text-tertiary' },
  cost: { bg: 'bg-secondary text-surface-container-lowest', hover: 'group-hover:text-secondary' },
  expats: { bg: 'bg-tertiary text-surface-container-lowest', hover: 'group-hover:text-tertiary' },
}

/** Category-themed images */
const categoryImages: Record<string, { src: string; alt: string }> = {
  guide: {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpGUMhhvZuBkcV72PpXznP8clDUbSrGaHfR_DNzDpXP8HqnMdQ7daaVUYg9ciKPwC8lYG_sDuiX1WHBR9_xG3ydgtSV1ZEM2XM4r3BSLzO3rUdmf-wsYZ4Ud4zOXNKk4lksglOkjpXuC93Uvc2xe5ImJGQ50EeeVGq7tMrh0ZGlkow7Fc6wn7bAa1wmy3bA5vABHaxPA4vhaid2Xkv-8Mw27SAS1i8LeuaFYdSrs1BGIT6Sh62gQhLcQkpWlA6aGaM0dAJrcnAYBA',
    alt: 'Dubai road at night',
  },
  tips: {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjm_hDHf18418PIMG37mKGFbZNpTxhStBht1zomV_8PuqitrTzZzA1ioCHEXC5JXXS-r7cYC3JTk9Pd2amfR6CrpratO9dcE8iuytyktRP2wMNNhsXjkQUD4rJ350eNf8vkJ2z19YSuPqoCCWV0rLvhKk3Xv83H2TIaQVY3torv8DAKrl_RwgpI6nx63l0VQ25jxwb8goCl3Lgnxg31gg8M3pPYUZZmsoUnzFl8uX873GpE7ABl9ged5CyNqaHEw5wKqFBfvobKcY',
    alt: 'Car steering wheel',
  },
  cost: {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF6t3fjRXlWcRFZkj6K9_mUqjX6DMe_p9VYD4asWOqzatqrwq7Z1gzc5Q78Ozi_Bq_ITwlcPxwL8-8pxpeDVJecKC8cQLzy-RJS3_b7a3jbGNcUnf3yrha8Nd0zkDyQmfes5ftPCd8B9Wf1SSzqHK8B2GDZx1sbiulcvK9nHsyWJmX1O5p2GuapJ1yD42eBbDtNZk_nY3XyUuwl5SWSLub2wiGJIHa5BRsr69Ls8xKeZltl9HmcMxiH_EkgnqaP-Xnxr5OddYwCMM',
    alt: 'Currency and car keys',
  },
  signs: {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpGUMhhvZuBkcV72PpXznP8clDUbSrGaHfR_DNzDpXP8HqnMdQ7daaVUYg9ciKPwC8lYG_sDuiX1WHBR9_xG3ydgtSV1ZEM2XM4r3BSLzO3rUdmf-wsYZ4Ud4zOXNKk4lksglOkjpXuC93Uvc2xe5ImJGQ50EeeVGq7tMrh0ZGlkow7Fc6wn7bAa1wmy3bA5vABHaxPA4vhaid2Xkv-8Mw27SAS1i8LeuaFYdSrs1BGIT6Sh62gQhLcQkpWlA6aGaM0dAJrcnAYBA',
    alt: 'UAE road signs',
  },
  rules: {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjm_hDHf18418PIMG37mKGFbZNpTxhStBht1zomV_8PuqitrTzZzA1ioCHEXC5JXXS-r7cYC3JTk9Pd2amfR6CrpratO9dcE8iuytyktRP2wMNNhsXjkQUD4rJ350eNf8vkJ2z19YSuPqoCCWV0rLvhKk3Xv83H2TIaQVY3torv8DAKrl_RwgpI6nx63l0VQ25jxwb8goCl3Lgnxg31gg8M3pPYUZZmsoUnzFl8uX873GpE7ABl9ged5CyNqaHEw5wKqFBfvobKcY',
    alt: 'Driving rules',
  },
  expats: {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF6t3fjRXlWcRFZkj6K9_mUqjX6DMe_p9VYD4asWOqzatqrwq7Z1gzc5Q78Ozi_Bq_ITwlcPxwL8-8pxpeDVJecKC8cQLzy-RJS3_b7a3jbGNcUnf3yrha8Nd0zkDyQmfes5ftPCd8B9Wf1SSzqHK8B2GDZx1sbiulcvK9nHsyWJmX1O5p2GuapJ1yD42eBbDtNZk_nY3XyUuwl5SWSLub2wiGJIHa5BRsr69Ls8xKeZltl9HmcMxiH_EkgnqaP-Xnxr5OddYwCMM',
    alt: 'UAE driving for expats',
  },
}

export function BlogCard({ post, locale, index }: BlogCardProps) {
  const shadow = index % 2 === 0 ? 'neo-shadow-secondary' : 'neo-shadow-tertiary'
  const content = post.content[locale as 'en' | 'ar'] ?? post.content.en
  const badge = categoryBadge[post.category] ?? categoryBadge.guide
  const image = categoryImages[post.category] ?? categoryImages.guide
  const arrowColor = index % 2 === 0 ? 'text-secondary' : 'text-tertiary'

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className={`block bg-surface-container-high border-2 border-surface-container-lowest ${shadow} group cursor-pointer hover:-translate-y-1 transition-transform duration-200`}
    >
      {/* Image */}
      <div className="aspect-video relative overflow-hidden bg-surface-container">
        <img
          alt={image.alt}
          src={image.src}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />
        <div className={`absolute top-3 start-3 px-3 py-1 font-label font-black text-xs tracking-tight ${badge.bg}`}>
          {post.category.toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3">
        <h3 className={`font-headline font-bold text-base sm:text-lg leading-tight text-on-surface ${badge.hover} transition-colors`}>
          {content.title}
        </h3>
        <p className="text-sm text-on-surface-variant font-body line-clamp-2">
          {post.seo.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t-2 border-surface-container-low">
          <div className="flex items-center gap-2 text-on-surface-variant font-label text-xs font-bold">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
            {post.readTimeMinutes} MIN READ
          </div>
          <span className={`material-symbols-outlined ${arrowColor} opacity-0 group-hover:opacity-100 transition-opacity`} style={{ fontSize: 18 }}>
            north_east
          </span>
        </div>
      </div>
    </Link>
  )
}
