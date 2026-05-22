import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { PostMeta } from "./constants"

const postsDir = path.join(process.cwd(), "content/posts")

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return []
  const files = fs.readdirSync(postsDir)
  const posts = files
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(/\.mdx?$/, "")
      const raw = fs.readFileSync(path.join(postsDir, f), "utf-8")
      const { data, content } = matter(raw)
      return {
        slug,
        title: data.title || slug,
        date: (data.date ? new Date(data.date).toISOString().slice(0, 10) : "").toString(),
        tags: data.tags || [],
        categories: data.categories || [],
        content,
      }
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1))
  return posts
}

export function getPostBySlug(slug: string): PostMeta | null {
  const posts = getAllPosts()
  return posts.find((p) => p.slug === slug) ?? null
}

export function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getAllPosts()
  const idx = posts.findIndex((p) => p.slug === slug)
  return {
    prev: idx > 0 ? posts[idx - 1] : null,
    next: idx < posts.length - 1 ? posts[idx + 1] : null,
  }
}

export function getAllTags(): Record<string, number> {
  const tags: Record<string, number> = {}
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      tags[tag] = (tags[tag] || 0) + 1
    }
  }
  return tags
}

export function getAllCategories(): Record<string, number> {
  const cats: Record<string, number> = {}
  for (const post of getAllPosts()) {
    for (const cat of post.categories) {
      cats[cat] = (cats[cat] || 0) + 1
    }
  }
  return cats
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag))
}

export function getPostsByCategory(cat: string): PostMeta[] {
  return getAllPosts().filter((p) => p.categories.includes(cat))
}
