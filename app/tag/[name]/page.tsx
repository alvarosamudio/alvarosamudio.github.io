import Link from "next/link"
import { notFound } from "next/navigation"
import { getPostsByTag, getAllTags } from "@/lib/posts"

export async function generateStaticParams() {
  return Object.keys(getAllTags()).map((name) => ({ name }))
}

export default async function TagPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const posts = getPostsByTag(decodeURIComponent(name))
  if (posts.length === 0) notFound()

  return (
    <div className="page-container">
      <h1 className="page-title">
        Tag: <span className="page-subtitle">{decodeURIComponent(name)}</span>
      </h1>
      {posts.map((post) => (
        <div key={post.slug} className="archive-item">
          <span className="archive-date">{post.date?.replace(/-/g, "/")}</span>
          <Link href={`/posts/${post.slug}`} className="archive-link">
            {post.title}
          </Link>
        </div>
      ))}
    </div>
  )
}
