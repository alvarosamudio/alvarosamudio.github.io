import Link from "next/link"

export default function Paginator({
  current,
  total,
  basePath,
}: {
  current: number
  total: number
  basePath: string
}) {
  if (total <= 1) return null
  const pages: (number | "...")[] = []
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...")
    }
  }

  return (
    <nav className="paginator">
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="paginator-dots">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={p === 1 ? basePath : `${basePath}/page/${p}`}
            className={`paginator-page${p === current ? " active" : ""}`}
          >
            {p}
          </Link>
        ),
      )}
    </nav>
  )
}
