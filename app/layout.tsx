import type { Metadata } from "next"
import { siteConfig } from "@/lib/constants"
import { ThemeProvider } from "@/components/ThemeProvider"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  icons: siteConfig.favicon,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.language} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = sessionStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark-theme');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="wrapper">
            <Header />
            <main className="main">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
