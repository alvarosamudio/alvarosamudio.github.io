import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/posts"
import { siteConfig } from "@/lib/constants"
import MarkdownRenderer from "./MarkdownRenderer"
import Copyright from "@/components/Copyright"
import PostNav from "@/components/PostNav"
import TOC from "@/components/TOC"

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const { prev, next } = getAdjacentPosts(slug)
  const permalink = `${siteConfig.url}/posts/${slug}`

  return (
    <div className="post-layout">
      <article className="post-article">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            {siteConfig.author && <span className="post-author">{siteConfig.author}</span>}
            {post.date && <span className="post-date">{post.date}</span>}
            {post.categories.length > 0 && (
              <span className="post-categories">
                {post.categories.join(", ")}
              </span>
            )}
          </div>
        </header>

        <div className="post-content">
          <MarkdownRenderer content={post.content} />
        </div>

        <Copyright permalink={permalink} />
        <PostNav prev={prev} next={next} />
      </article>

      <TOC />
    </div>
  )
}
