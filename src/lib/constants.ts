export const siteConfig = {
  title: "Alvaro Samudio",
  author: "Alvaro Samudio",
  description: `⚔️ Cybersecurity enthusiast. 🛡️
⚙️ Open source.
🌱 Nature lover.
⚡ I like to program 👨‍💻, read 📚, take pictures 📸.
📫 You can find my contact information on the left. 🏴‍☠️`,
  url: "https://alvarosamudio.github.io",
  language: "es",
  avatar: "https://avatars.githubusercontent.com/alvarosamudio",
  favicon: "/favicon.ico",

  nav: {
    Posts: "/archives",
    Categories: "/category",
    Tags: "/tag",
    About: "/about",
  },

  links: {
    Blog: "/archives",
    Github: "https://github.com/alvarosamudio",
  },

  post: {
    copyright: {
      licenseText:
        'Copyright (c) 2019 <a href="https://www.gnu.org/licenses/gpl-3.0.html">GPL-3.0</a> LICENSE',
      slogan: "Do you believe in <strong>DESTINY</strong>?",
    },
  },

  pagination: {
    perPage: 10,
  },
}

export type PostMeta = {
  slug: string
  title: string
  date: string
  tags: string[]
  categories: string[]
  content: string
}
