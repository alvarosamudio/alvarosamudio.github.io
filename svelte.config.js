import adapter from "@sveltejs/adapter-static"

const config = {
  kit: {
    adapter: adapter({
      fallback: "404.html",
      pages: "out",
      assets: "out",
    }),
  },
}

export default config
