"use client"

import { useEffect, useState } from "react"

type TocItem = { id: string; text: string; level: number }

export default function TOC() {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const headers = document.querySelectorAll<HTMLHeadingElement>(
      ".post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6",
    )
    const toc: TocItem[] = []
    headers.forEach((h) => {
      if (!h.id) {
        h.id = h.textContent?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || ""
      }
      toc.push({ id: h.id, text: h.textContent || "", level: parseInt(h.tagName[1], 10) })
    })
    setItems(toc)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" },
    )
    headers.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [])

  if (items.length === 0) return null

  return (
    <aside className="post-toc">
      <nav className="toc-nav">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`toc-link toc-level-${item.level}${activeId === item.id ? " active" : ""}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            {item.text}
          </a>
        ))}
      </nav>
      <div className="toc-actions">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ↑ Back to top
        </button>
        <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}>
          ↓ Go to bottom
        </button>
      </div>
    </aside>
  )
}
