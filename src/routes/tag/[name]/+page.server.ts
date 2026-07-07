import { getPostsByTag, getAllTags } from "$lib/posts"
import { error } from "@sveltejs/kit"

export const entries = () => {
  return Object.keys(getAllTags()).map((name) => ({ name }))
}

export function load({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name)
  const posts = getPostsByTag(name)
  if (posts.length === 0) error(404)
  return { name, posts }
}
