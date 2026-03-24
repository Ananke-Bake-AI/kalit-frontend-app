"use client"

import { getIdenticonDataUri } from "@/lib/dicebear-identicon"
import clsx from "clsx"
import { useMemo } from "react"
import s from "./avatar.module.scss"

/** Résolution interne de l’identicon (le rendu final suit `--avatar-size` en CSS) */
const IDENTICON_RENDER_PX = 256

export interface AvatarProps {
  name: string
  className?: string
}

/**
 * Identicon [DiceBear](https://www.dicebear.com/styles/identicon/) déterministe à partir du `name`.
 * Taille : `--avatar-size` sur l’élément (défaut `1em` dans le module) ; surcharger via `className`.
 */
export function Avatar({ name, className }: AvatarProps) {
  const displayName = name.trim() || "User"

  const src = useMemo(
    () => getIdenticonDataUri(displayName, { size: IDENTICON_RENDER_PX, radius: 50 }),
    [displayName]
  )

  return (
    <span className={clsx(s.root, className)}>
      <img src={src} alt="" decoding="async" />
    </span>
  )
}
