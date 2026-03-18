"use client"

import { Button } from "@/components/button"
import { Link } from "@/components/link"
import { Logotype } from "@/components/logotype"
import { useAppStore } from "@/stores/app"
import { useSession, signOut } from "next-auth/react"
import clsx from "clsx"
import { useState, useRef, useEffect } from "react"
import { Nav } from "../nav"
import s from "./header.module.scss"

export const Header = () => {
  const { nav, setNav } = useAppStore()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className={clsx(s.header, nav && s.open)}>
      <div className={s.content}>
        <Link href="/" className={s.logo}>
          <Logotype />
        </Link>
        <Nav />

        {session?.user ? (
          <div className={s.userMenu} ref={menuRef}>
            <button
              className={s.userBtn}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="User menu"
            >
              <span className={s.avatar}>
                {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase() || "U"}
              </span>
              <span className={s.userName}>{session.user.name || "Account"}</span>
            </button>
            {menuOpen && (
              <div className={s.dropdown}>
                <Link href="/dashboard" className={s.dropdownItem} onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/settings/profile" className={s.dropdownItem} onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Link href="/settings/billing" className={s.dropdownItem} onClick={() => setMenuOpen(false)}>
                  Billing
                </Link>
                <button
                  className={s.dropdownItem}
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button className={s.btn} circle href="/register">
            Get early access
          </Button>
        )}

        <button className={s.bnav} onClick={() => setNav(!nav)} aria-label="Navigation">
          <svg viewBox="0 0 100 100">
            <path className={s.l1} d="M0,42h62c13,0,6,26-4,16L35,35" />
            <path className={s.l2} d="M0,50h70" />
            <path className={s.l3} d="M0,58h62c13,0,6-26-4-16L35,65" />
          </svg>
        </button>
        <div className={s.bg} />
      </div>
    </header>
  )
}
