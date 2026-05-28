import Link from "next/link"
import { getAllTags } from "@/lib/posts"

export default function TagIndexPage() {
  const tags = getAllTags()

  if (Object.keys(tags).length === 0) {
    return (
      <div className="page-container">
        <h1 className="page-title">Tags</h1>
        <p className="empty-message">No tags yet.</p>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Tags</h1>
      <div className="tag-cloud">
        {Object.entries(tags).map(([tag, count]) => (
          <Link
            key={tag}
            href={`/tag/${encodeURIComponent(tag)}`}
            className="tag-item"
          >
            {tag}
            <sup className="tag-count">{count}</sup>
          </Link>
        ))}
      </div>
    </div>
  )
}
