"use client"

import { useEffect, useMemo, useState } from "react"
import { Icon } from "@/components/icon"
import { useI18n } from "@/stores/i18n"
import s from "./file-preview-modal.module.scss"

export interface PreviewItem {
  url: string
  name: string
}

interface FilePreviewModalProps {
  url: string
  name: string
  onClose: () => void
  items?: PreviewItem[]
}

export function FilePreviewModal({ url, name, onClose, items }: FilePreviewModalProps) {
  const { t } = useI18n()

  // Derive the navigable list. If no list is supplied, fall back to showing
  // just the single file — prev/next arrows are hidden in that case.
  const list = useMemo<PreviewItem[]>(() => {
    if (items && items.length > 0) return items
    return [{ url, name }]
  }, [items, url, name])

  // Start at the index of the initial file (match by url for stability).
  const initialIndex = useMemo(() => {
    const i = list.findIndex((it) => it.url === url)
    return i >= 0 ? i : 0
  }, [list, url])

  const [index, setIndex] = useState(initialIndex)
  useEffect(() => setIndex(initialIndex), [initialIndex])

  const current = list[index] ?? { url, name }
  const canNav = list.length > 1

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (!canNav) return
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + list.length) % list.length)
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % list.length)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, canNav, list.length])

  return (
    <div className={s.overlay} onClick={onClose}>
      <button
        className={s.closeBtn}
        onClick={(e) => { e.stopPropagation(); onClose() }}
        title={t("studio.close")}
      >
        <Icon icon="hugeicons:cancel-01" />
      </button>

      {canNav && (
        <>
          <button
            className={`${s.navBtn} ${s.navPrev}`}
            onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + list.length) % list.length) }}
            title={t("studio.previous")}
          >
            <Icon icon="hugeicons:arrow-left-01" />
          </button>
          <button
            className={`${s.navBtn} ${s.navNext}`}
            onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % list.length) }}
            title={t("studio.next")}
          >
            <Icon icon="hugeicons:arrow-right-01" />
          </button>
        </>
      )}

      <div className={s.container} onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.url} alt={current.name} className={s.image} />

        <div className={s.footer}>
          <span className={s.fileName}>{current.name}</span>
          {canNav && (
            <span className={s.counter}>{index + 1} / {list.length}</span>
          )}
          <a href={current.url} download={current.name} className={s.downloadBtn}>
            <Icon icon="hugeicons:download-04" />
            {t("studio.download")}
          </a>
        </div>
      </div>
    </div>
  )
}
