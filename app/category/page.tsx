import Link from "next/link"
import { getAllCategories, getAllPosts } from "@/lib/posts"

export default function CategoryIndexPage() {
  const categories = getAllCategories()
  const posts = getAllPosts()

  if (Object.keys(categories).length === 0) {
    return (
      <div className="page-container">
        <h1 className="page-title">Categories</h1>
        <p className="empty-message">No categories yet.</p>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Categories</h1>
      <div className="category-cards">
        {Object.entries(categories).map(([cat, count]) => (
          <div key={cat} className="category-card">
            <Link href={`/category/${encodeURIComponent(cat)}`}>
              <h2>{cat}</h2>
              <span className="category-count">{count} posts</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
