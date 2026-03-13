"use client"

import { Link } from "@/components/link"
import { Logo } from "@/components/logo"
import { SUITES } from "@/lib/suites"
import { useAppStore } from "@/stores/app"
import { Icon } from "@iconify/react"
import clsx from "clsx"
import s from "./nav.module.scss"

export const Nav = () => {
  const { nav } = useAppStore()

  return (
    <nav className={clsx(s.nav, nav && s.open)}>
      <ul>
        <li className={s.subnav}>
          <span className={clsx(s.link, s.sublink)}>
            Suites <Icon icon="hugeicons:arrow-down-01" />
          </span>
          <ul className={s.sub}>
            {SUITES.map(({ id, title, color, smallDescription }) => (
              <li key={id} style={{ "--color": color } as React.CSSProperties}>
                <Link href={`/${id}`}>
                  <div className={s.logo}>
                    <Logo id={id} />
                  </div>
                  <span className={s.content}>
                    <strong>{title}</strong>
                    <p>{smallDescription}</p>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <Link href="/" className={s.link}>
            How it works
          </Link>
        </li>
        <li>
          <Link href="/" className={s.link}>
            Try now
          </Link>
        </li>
        <li>
          <Link href="/" className={s.link}>
            Why Kalit?
          </Link>
        </li>
      </ul>
    </nav>
  )
}
