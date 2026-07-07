import { getPostsByCategory, getAllCategories } from "$lib/posts"
import { error } from "@sveltejs/kit"

export const entries = () => {
  return Object.keys(getAllCategories()).map((name) => ({ name }))
}

export function load({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name)
  const posts = getPostsByCategory(name)
  if (posts.length === 0) error(404)
  return { name, posts }
}
