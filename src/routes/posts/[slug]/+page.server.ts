import { getAllPosts, getPostBySlug, getAdjacentPosts } from "$lib/posts"
import { siteConfig } from "$lib/constants"
import { error } from "@sveltejs/kit"

export const entries = () => {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export function load({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) error(404)

  const { prev, next } = getAdjacentPosts(params.slug)
  const permalink = `${siteConfig.url}/posts/${params.slug}`

  return { post, prev, next, permalink }
}
