import { auth } from "@/lib/auth"
import { StudioShell } from "./studio-shell"

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return <StudioShell session={session}>{children}</StudioShell>
}
