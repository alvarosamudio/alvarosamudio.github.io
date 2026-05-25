import Link from "next/link"
import type { PostMeta } from "@/lib/constants"

export default function PostNav({
  prev,
  next,
}: {
  prev: PostMeta | null
  next: PostMeta | null
}) {
  return (
    <div className="post-nav">
      {prev ? (
        <Link href={`/posts/${prev.slug}`} className="post-nav-prev">
          <span className="post-nav-arrow">‹</span>
          <span>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/posts/${next.slug}`} className="post-nav-next">
          <span>{next.title}</span>
          <span className="post-nav-arrow">›</span>
        </Link>
      ) : (
        <span />
      )}
    </div>
  )
}
