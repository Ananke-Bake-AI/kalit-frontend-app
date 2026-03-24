import { auth } from "@/lib/auth"
import { checkSuiteAccess } from "@/lib/entitlements"
import { redirect } from "next/navigation"
import { SuiteWorkspaceView } from "../(components)/suite-workspace-view"

export default async function FlowPage() {
  const session = await auth()
  if (!session?.user?.orgId) redirect("/login")

  const hasAccess = await checkSuiteAccess(session.user.orgId, "flow")

  return (
    <SuiteWorkspaceView suiteId="flow" launcherDisplayName="Flow" hasAccess={hasAccess} />
  )
}
