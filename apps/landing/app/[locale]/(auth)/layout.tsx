import { Wrapper } from "@/components/layout/wrapper"
import { auth } from "@/lib/auth"
import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <Wrapper session={session} color4bg={true}>
      {children}
    </Wrapper>
  )
}
