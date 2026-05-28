import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        a: ({ href, ...props }) => (
          <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" {...props} />
        ),
        img: ({ src, alt, title }) => (
          <div className="image-box">
            <img src={src} alt={alt || ""} title={title || ""} />
            {title && <p className="image-box-title">{title}</p>}
          </div>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
