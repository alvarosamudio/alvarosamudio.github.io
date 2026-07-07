import { getAllPosts } from "$lib/posts"

export function load() {
  const posts = getAllPosts()

  const grouped: Record<string, typeof posts> = {}
  for (const post of posts) {
    const year = post.date?.slice(0, 4) || "Unknown"
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(post)
  }

  return { grouped, total: posts.length }
}
