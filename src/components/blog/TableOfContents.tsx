'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

interface TOCItem {
  id: string
  text: string
}

interface TableOfContentsProps {
  items: TOCItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [open, setOpen] = useState(false)

  if (items.length === 0) return null

  return (
    <>
      {/* Mobile: collapsible */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setOpen(!open)}
          className="neo-push w-full flex items-center justify-between bg-surface-container border-2 border-surface-container-lowest neo-shadow px-4 py-3"
        >
          <span className="font-label text-sm font-bold uppercase tracking-wider text-secondary">
            Table of Contents
          </span>
          <span className="material-symbols-outlined text-secondary" style={{ fontSize: 20 }}>
            {open ? 'expand_less' : 'expand_more'}
          </span>
        </button>
        {open && (
          <nav className="bg-surface-container border-2 border-t-0 border-surface-container-lowest px-4 py-3">
            <ol className="space-y-2">
              {items.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-2 text-sm text-on-surface-variant hover:text-secondary transition-colors font-body"
                  >
                    <span className="font-label text-xs text-outline mt-0.5 flex-shrink-0">{i + 1}.</span>
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>

      {/* Desktop: sticky sidebar */}
      <nav className="hidden lg:block sticky top-24 w-64 flex-shrink-0" aria-label="Table of contents">
        <div className="bg-surface-container border-2 border-surface-container-lowest neo-shadow p-4">
          <h2 className="font-label text-xs font-bold uppercase tracking-wider text-secondary mb-3">
            Table of Contents
          </h2>
          <ol className="space-y-2">
            {items.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="flex items-start gap-2 text-sm text-on-surface-variant hover:text-secondary transition-colors font-body"
                >
                  <span className="font-label text-xs text-outline mt-0.5 flex-shrink-0">{i + 1}.</span>
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  )
}
