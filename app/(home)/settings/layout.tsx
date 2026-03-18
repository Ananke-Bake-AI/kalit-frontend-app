"use client"

import { Container } from "@/components/container"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import s from "../app.module.scss"

const TABS = [
  {
    href: "/settings/profile",
    label: "Profile",
    description: "Manage your account details and sign-in settings.",
  },
  {
    href: "/settings/workspace",
    label: "Workspace",
    description: "View your workspace name, website, and basic details.",
  },
  {
    href: "/settings/team",
    label: "Team",
    description: "View members, roles, and seat usage.",
  },
  {
    href: "/settings/billing",
    label: "Billing",
    description: "Manage your plan, subscription, and upgrades.",
  },
  {
    href: "/settings/usage",
    label: "Usage",
    description: "View credits and recent activity.",
  },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentTab = TABS.find((tab) => tab.href === pathname) ?? TABS[0]

  return (
    <section className={s.page}>
      <Container>
        <div className={s.pageHeader}>
          <h1>{currentTab.label}</h1>
          <p>{currentTab.description}</p>
        </div>

        <div className={s.settingsShell}>
          <nav className={s.settingsTabs}>
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={clsx(pathname === tab.href && s.active)}
              >
                <span className={s.tabLabel}>{tab.label}</span>
                <span className={s.tabDescription}>{tab.description}</span>
              </Link>
            ))}
          </nav>

          <div className={s.settingsContent}>{children}</div>
        </div>
      </Container>
    </section>
  )
}
