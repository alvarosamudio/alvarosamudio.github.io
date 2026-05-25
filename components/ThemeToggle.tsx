"use client"

import { useTheme } from "./ThemeProvider"

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <label className="theme-toggle">
      <input type="checkbox" checked={theme === "dark"} onChange={toggle} />
      <span className="toggle-slider" />
    </label>
  )
}
