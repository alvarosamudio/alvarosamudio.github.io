import Link from "next/link"

export default function NotFound() {
  return (
    <div className="page-container">
      <h1>404</h1>
      <p>Page not found</p>
      <Link href="/">← Back to Home</Link>
    </div>
  )
}
