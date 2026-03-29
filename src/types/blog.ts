export interface BlogSection {
  heading: string
  body: string
  /** Optional CTA linking to a quiz module */
  cta?: {
    text: string
    href: string
  }
}

export interface BlogContentLocale {
  title: string
  subtitle?: string
  sections: BlogSection[]
}

export interface BlogFAQ {
  q: string
  a: string
}

export interface BlogPost {
  slug: string
  publishedAt: string
  updatedAt: string
  author: string
  readTimeMinutes: number
  targetKeyword: string
  category: 'guide' | 'tips' | 'signs' | 'rules' | 'cost' | 'expats'
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  content: {
    en: BlogContentLocale
    ar?: BlogContentLocale
  }
  faq: BlogFAQ[]
  relatedQuizModules: string[]
  internalLinks: string[]
  relatedSlugs: string[]
}
