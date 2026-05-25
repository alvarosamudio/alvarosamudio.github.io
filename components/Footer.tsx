import { siteConfig } from "@/lib/constants"

export default function Footer() {
  return (
    <footer className="footer">
      <span>&copy; {new Date().getFullYear()} {siteConfig.author}</span>
    </footer>
  )
}
