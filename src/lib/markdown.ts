import { marked, Renderer } from "marked"
import hljs from "highlight.js/lib/core"
import css from "highlight.js/lib/languages/css"
import dockerfile from "highlight.js/lib/languages/dockerfile"
import html from "highlight.js/lib/languages/xml"
import javascript from "highlight.js/lib/languages/javascript"
import json from "highlight.js/lib/languages/json"
import sql from "highlight.js/lib/languages/sql"
import typescript from "highlight.js/lib/languages/typescript"

hljs.registerLanguage("css", css)
hljs.registerLanguage("dockerfile", dockerfile)
hljs.registerLanguage("html", html)
hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("json", json)
hljs.registerLanguage("sql", sql)
hljs.registerLanguage("typescript", typescript)

const renderer = new Renderer()

renderer.link = ({ href, title, text }) => {
  const target = href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""
  const titleAttr = title ? ` title="${title}"` : ""
  return `<a href="${href}"${target}${titleAttr}>${text}</a>`
}

renderer.image = ({ href, title, text }) => {
  const caption = title ? `<p class="image-box-title">${title}</p>` : ""
  return `<div class="image-box"><img src="${href}" alt="${text}"${title ? ` title="${title}"` : ""} />${caption}</div>`
}

renderer.code = ({ text, lang }) => {
  const highlighted =
    lang && hljs.getLanguage(lang)
      ? hljs.highlight(text, { language: lang }).value
      : hljs.highlightAuto(text).value
  const langClass = lang ? ` class="language-${lang}"` : ""
  return `<pre><code${langClass}>${highlighted}</code></pre>`
}

marked.use({ renderer })

export function renderMarkdown(content: string): string {
  return marked.parse(content, { gfm: true }) as string
}
