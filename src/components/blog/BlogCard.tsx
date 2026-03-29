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

/** Unique contextual images per blog post (generated via Stitch AI) */
const postImages: Record<string, { src: string; alt: string }> = {
  'rta-theory-test-dubai-complete-guide': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpFuPJfXB31gUm5BkK_KKcEAZpezJS9wscImgndJBFLQZp3ORGqUGoKVPCSYDklKlox7TCQqEhLE4b89CmM4fRjIeDeV9lhQ4cW9mqXgNwCE2RQXBeBjwJ83Ewp3PB3qqlt3Wv6og6s89oMPvPqSOjPClMO6akVqigPqmE2PzSP2OK_KgeRfqFLwze6gNiEYK_cpNXETmfysn9XPUzqxR8j3I7NvqByJ9L5qyWvtYI3QM-rsN2_-Ln-EowtNZtEehcOwoxU37juKs',
    alt: 'Dubai Sheikh Zayed Road at night with car light trails and skyscrapers',
  },
  'abu-dhabi-driving-theory-test-guide': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE5Fqw7QaJFTmRR4tk2TEh3yt2RJa4ADgWJCjr5QRed7viBqOYjRB5x148l6p_FkXejkkjdeSvX619kuY1fl6fSFUWQ3mkgXpkXqDGCWmjIxipQyoTtjBqo4Ijfl4dsH5wP69jG2Mi7HS6H7uy0uMAnaUp1cXq9am1lXijAqR1-uPvI8vT8_Uu65yYbQ3uJ_VO2OYnBhtj-4xNnvqrXMxW5d01fK-0cH4PG58Ds2bnsW39VtWKY1TrX6jvFt8DeZGyzfCvbl2PBwc',
    alt: 'Abu Dhabi Corniche road with Etihad Towers at golden hour',
  },
  'uae-road-signs-complete-guide': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyOGgby4QYP4iPkQiWilkH4MMiowfN8Rxc_uxFeV2Gvw85u5G2pnt5hqdOdE7YrTUjvwZFnca3CEeHg-SADoFPMEbFEm7cZyZjqLMmLOJuyC163c9ULVMy1EF6VfwpOeVQHg4XrMZVQlGwGU9NA1IYc0ncYd-PccKEQESGev-CPx8VlstDxZcf6WDjBO-RAzoIi4okKgQrAFTvOCBszDQ9NXYzrtZwb58qg1nLoBVVmJAgYS7GGhc1fxdYVggjK8ocQ8nJiBcllHU',
    alt: 'UAE traffic signs on a desert highway at twilight',
  },
  'how-to-pass-rta-theory-test-first-time': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-YvvVhSUhZeLWbc7qrByMJFAdnD1UsPh7RWCIwoOk2J0ePQXxd6UZTcmkhrBca_tDItljXPKUUt9m_V60yrYB2XgIv5BBkA-mitI2GA1Y7cXAeu1IUlQx_ePriuw3LuiLkJCdtZyUXK_WHuBUuIqzEtJ_H-nusuhlJoUgxwskKZYXPFrHw6H3wwW_oxyHi__O1Lnplj0tV_AU7XtxHuuU7d52AbCW5l_XMdHBE87Bw-zAxDgVgvTx3QzPM3Q_mWJYERqA8LxA6vQ',
    alt: 'Person studying for driving test at desk with laptop',
  },
  'rta-theory-test-questions-answers-2026': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmPti-LKQ7X_IUcO5bWd_yt796ZyZUGRXUJ44KpmowupeBL5anGWRgbuI_fRzv5tubBchbOS6AZsXvSdx1CVMGs5nJ7IIdBhPYMxcQ5V-uyTjpg3W0q8BVUZpJb2UlnZ6RGMZT5pTdNM0ALMdu54h6wr9BliqEtnOX2fKnpkWkx6PKJv9Xerk9n5TamCy5UE2xr0zc9os2RC1X5-ql4w32eSSZf_hMw0eViOse96mGvFxlAXPnNGjzFC6LoGw2AHFlhtRCbSAfMWQ',
    alt: 'Computer screen showing driving theory test questions',
  },
  'dubai-driving-license-cost-2026': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTZyDlkxIsxhV8Mw-gD4Gr_70J3ivYjm8dPPymF5bfhhSnqxkObIF1yQ0e9qcQbF8AtqVY08BY2jEuNGqH5AA8azKY6WelzqrNLnKLeK1Kb4e0maHNi3VexEpfiQkkVg-sBg9jT4ahJDjztjTKQRw9yRTOSyrifJXYbbeOBlyfJQz7yndPHvbIfRyo4-UBwte11A60dzUNl5j4OEeXSfRtoqzfWyAANVHMLC0k7pJfS7DSHyOMowkBpfAZDnSQUGQng2aatV2pAL4',
    alt: 'UAE Dirham banknotes and coins with car keys and license',
  },
  'uae-traffic-fines-black-points-2026': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrlLRFrEpsy4rUqmge-YnqsIzbElel4AYEnp54u8fr_HDNkwIHN7zziLUW1ignLGUIWQtzgXTw_u_J_zGXdiDVvm1kaOYdRwMjoUmzNWzv4bdoYGwPHWq0GUe67UqOyEInFlzf5t9YvYK3EuFthDZzHHWDD9Tq3MtQodv2k2T2fnB8Iw_B9bDZzTsfY068961tkM04OA21uDzJYIk5lQ4_SQvCvzSkt9HfqEoUrKUv1eL_kpl-VAx8zs3eHxdZsHiDsJKUn36Pv8Y',
    alt: 'Speed camera flash on UAE highway at night',
  },
  'motorcycle-theory-test-uae-guide': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvdb-_BIU4FwEWc5dx4tTbWF692_fffiqwkz8o3GJM25AE3dij8wUdtUSbMdhTNYwQT92BHfiRDzvhetAKi3nEciZq5_aWwGYZdrvNtvfupLx7xh1JUWtywumr8zbSEPBla62XKpk3PrTdTtgzKHY5vQ2mISAQLBRQbpAwyg6bjuwj9LGk3U4E9jVTBkwrWCgol_Vit62kKHS6VVo2xJibJTiJMtwDOg3n6uvDm0LkGreALZqUrlAoMc2hfgX_oFMyp8-HiMhbO2Q',
    alt: 'Motorcycle parked on a Dubai city street at night with neon reflections',
  },
  'rta-theory-test-hindi-urdu-guide': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOi-VgtGi3DpRJTyJF41ikfEC6SKcFu-TDsmLBfsQZXdO9HuDkh6qxO26gFKUeeALMi7F9As0e5UH9NT6DhVvh4YgRuSOn8XT2LztiACbf48UH2inIr6UXZvYSTQ7aeX6HjIOyubpY9qfJWY8NbXW-L0cf2lbG2y-TGhNo05_S81YDagBAv44paxpDc1pZAFs5tr9gh3It6m5a6b68UkfqOiMNxg1N_V6mcPTzyJ603ZTTSGwIm5J6SVjtfXGZ8d4EmXMA9Jo5gDA',
    alt: 'Diverse group in a UAE driving school classroom',
  },
  'uae-driving-test-tips-expats': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_O0GIo6Fcj7HZ0bclnIF6gkQLyhL519ayxKFselkaj5-pYClVr1p5Sziw1_25AgG0p5zlLF_ojZ_7brc5Yr2_5acbQkfY8X0XIOcInqXQhJoY33tAY6h1-ckQdaKw8NGt4Vi9TUlYhYGp9f8tT3Gj76MSo0_wUfFCxQxndp0mPnCPc87mZzR-tnJEhxDy1nhjYPNdJc94N5A_9a6kiHTioURbZe-X6-0CCA4c6zvsFgAKd20uDS9iWlHsF3qYhd9nIFxvObeBkFc',
    alt: 'Desert highway in UAE with sand dunes and dramatic sunset',
  },
}

const fallbackImage = {
  src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpFuPJfXB31gUm5BkK_KKcEAZpezJS9wscImgndJBFLQZp3ORGqUGoKVPCSYDklKlox7TCQqEhLE4b89CmM4fRjIeDeV9lhQ4cW9mqXgNwCE2RQXBeBjwJ83Ewp3PB3qqlt3Wv6og6s89oMPvPqSOjPClMO6akVqigPqmE2PzSP2OK_KgeRfqFLwze6gNiEYK_cpNXETmfysn9XPUzqxR8j3I7NvqByJ9L5qyWvtYI3QM-rsN2_-Ln-EowtNZtEehcOwoxU37juKs',
  alt: 'UAE driving',
}

export function BlogCard({ post, locale, index }: BlogCardProps) {
  const shadow = index % 2 === 0 ? 'neo-shadow-secondary' : 'neo-shadow-tertiary'
  const content = post.content[locale as 'en' | 'ar'] ?? post.content.en
  const badge = categoryBadge[post.category] ?? categoryBadge.guide
  const image = postImages[post.slug] ?? fallbackImage
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
