"use client"

import Link from "next/link"
import { siteConfig } from "@/lib/constants"
import ThemeToggle from "./ThemeToggle"
import { useState } from "react"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="logo">
          {siteConfig.title}
        </Link>

        <nav className="nav-desktop">
          {Object.entries(siteConfig.nav).map(([label, href]) => (
            <Link key={label} href={href} className="nav-link">
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="nav-mobile">
          {Object.entries(siteConfig.nav).map(([label, href]) => (
            <Link key={label} href={href} className="nav-link" onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          <div className="mobile-toggle-wrapper">
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  )
}
