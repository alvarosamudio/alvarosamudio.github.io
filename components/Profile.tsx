import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/lib/constants"

const linkIcons: Record<string, string> = {
  Blog: "📝",
  ZhiHu: "知",
  Instagram: "📷",
  Reddit: "💬",
  Github: "🐙",
}

export default function Profile() {
  return (
    <div className="profile">
      <Link href="/archives">
        <Image
          src={siteConfig.avatar}
          alt={siteConfig.author}
          width={128}
          height={128}
          className="profile-avatar"
        />
      </Link>
      <h1 className="profile-nickname">{siteConfig.author}</h1>
      <div
        className="profile-description"
        dangerouslySetInnerHTML={{ __html: siteConfig.description.replace(/\n/g, "<br>") }}
      />
      <div className="profile-links">
        {Object.entries(siteConfig.links).map(([label, href]) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="profile-link"
            title={label}
          >
            {linkIcons[label] || label.slice(0, 2)}
          </a>
        ))}
      </div>
    </div>
  )
}
