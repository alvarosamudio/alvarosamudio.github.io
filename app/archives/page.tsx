import Link from "next/link"
import { getAllPosts } from "@/lib/posts"

export default function ArchivesPage() {
  const posts = getAllPosts()

  const grouped: Record<string, typeof posts> = {}
  for (const post of posts) {
    const year = post.date?.slice(0, 4) || "Unknown"
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(post)
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Archives</h1>
      {Object.entries(grouped).map(([year, yearPosts]) => (
        <div key={year} className="archive-year">
          <h2 className="archive-year-title">{year}</h2>
          {yearPosts.map((post) => (
            <div key={post.slug} className="archive-item">
              <span className="archive-date">{post.date?.replace(/-/g, "/")}</span>
              <Link href={`/posts/${post.slug}`} className="archive-link">
                {post.title}
              </Link>
            </div>
          ))}
        </div>
      ))}
      {posts.length === 0 && <p className="empty-message">No posts yet.</p>}
    </div>
  )
}
