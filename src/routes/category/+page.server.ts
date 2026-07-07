import { getAllCategories } from "$lib/posts"

export function load() {
  const categories = getAllCategories()
  return { categories }
}
