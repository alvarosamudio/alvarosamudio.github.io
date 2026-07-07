import { getAllTags } from "$lib/posts"

export function load() {
  const tags = getAllTags()
  return { tags }
}
