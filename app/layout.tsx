import { Wrapper } from "@/components/layout/wrapper"
import { APP_THEME_COLOR } from "@/lib/config"
import { MetadataSeo } from "@/lib/metadata"
import "@/styles/globals.scss"
import { fonts } from "./fonts"

export const metadata = MetadataSeo({
  title: "The world’s most advanced AI agent models",
  description:
    "Let Kalit build your team using the world’s most advanced AI agent models — and together, launch and scale your project from A to Z, across the globe."
})

export const viewport = {
  themeColor: APP_THEME_COLOR
}

export interface LayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning={true}>
      <link
        rel="preload"
        href="/fonts/cal-sans/CalSans-SemiBold.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <body className={fonts}>
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  )
}
