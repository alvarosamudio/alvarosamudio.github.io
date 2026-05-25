import { siteConfig } from "@/lib/constants"

export default function Copyright({ permalink }: { permalink: string }) {
  const { copyright } = siteConfig.post
  return (
    <div className="post-copyright">
      <div className="post-copyright-item">
        <strong>Author:</strong> {siteConfig.author}
      </div>
      <div className="post-copyright-item">
        <strong>Permalink:</strong>{" "}
        <a href={permalink} target="_blank" rel="noopener noreferrer">
          {permalink}
        </a>
      </div>
      <div className="post-copyright-item">
        <strong>License:</strong>{" "}
        <span dangerouslySetInnerHTML={{ __html: copyright.licenseText }} />
      </div>
      <div
        className="post-copyright-slogan"
        dangerouslySetInnerHTML={{ __html: copyright.slogan }}
      />
    </div>
  )
}
