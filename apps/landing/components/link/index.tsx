"use client"

import { localePath, stripLocalePrefix } from "@/lib/i18n"
import { useI18n } from "@/stores/i18n"
import clsx from "clsx"
import NextLink, { LinkProps as NextLinkProps } from "next/link"
import { usePathname } from "next/navigation"
import type { CSSProperties } from "react"
import { forwardRef, MouseEvent } from "react"

interface LinkProps extends Omit<NextLinkProps, "href"> {
  href: string
  title?: string
  className?: string
  style?: CSSProperties
  children: React.ReactNode
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void
  isActive?: boolean
  activeClassName?: string
}

export const Link = forwardRef<HTMLAnchorElement | HTMLDivElement, LinkProps>(
  (
    {
      href,
      title,
      className,
      style,
      onClick,
      children,
      isActive,
      activeClassName,
      ...props
    },
    ref
  ) => {
    const pathname = usePathname()
    const { locale } = useI18n()
    const isExternal = href.startsWith("http")
    const barePath = stripLocalePrefix(pathname)
    const hashIndex = href.indexOf("#")
    const hasHash = !isExternal && hashIndex >= 0
    const hrefPath = hasHash ? href.slice(0, hashIndex) : href
    const targetId = hasHash ? href.slice(hashIndex + 1) : ""
    const normalizedHrefPath = hrefPath ? stripLocalePrefix(hrefPath) : barePath
    const isSamePageAnchor = hasHash && (!hrefPath || normalizedHrefPath === barePath)
    const isCurrentPath = !isExternal && !hasHash && barePath === href
    const isCurrentActive = isActive !== undefined ? isActive : isCurrentPath

    const resolvedHref = isExternal || href.startsWith("#") ? href : localePath(href, locale)

    const attr = isExternal
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {}

    const handleClick = (e: MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
      if (isSamePageAnchor) {
        e.preventDefault()
        if (targetId) {
          window.history.pushState(null, "", resolvedHref)
          window.dispatchEvent(new Event("kalit:hash-scroll"))
        }
      }
      onClick?.(e)
    }

    if (isSamePageAnchor) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          onClick={handleClick}
          href={resolvedHref}
          title={title}
          className={className}
          style={style}
          data-pointer
        >
          {children}
        </a>
      )
    }

    return (
      <NextLink
        ref={ref as React.Ref<HTMLAnchorElement>}
        onClick={handleClick}
        href={resolvedHref}
        title={title}
        className={clsx(className, isCurrentActive && activeClassName)}
        style={style}
        {...props}
        {...attr}
      >
        {children}
      </NextLink>
    )
  }
)

Link.displayName = "Link"
