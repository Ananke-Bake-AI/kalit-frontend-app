"use client"

import { useEffect, useRef, useState } from "react"
import { useStudioUser } from "../../host"
import { useStudioStore, type TaskforceStandard } from "../../store"
import s from "./model-selector.module.scss"

interface ModelOption {
  id: string
  label: string
  provider: "ollama" | "anthropic" | "mistral" | "openai"
}

const MODEL_GROUPS: { label: string; models: ModelOption[] }[] = [
  {
    label: "Ollama Cloud",
    models: [
      { id: "minimax-m2.7:cloud", label: "minimax-m2.7", provider: "ollama" },
      { id: "minimax-m2.5:cloud", label: "minimax-m2.5", provider: "ollama" },
      { id: "glm-5.1:cloud", label: "glm-5.1", provider: "ollama" },
      { id: "glm-5:cloud", label: "glm-5", provider: "ollama" },
      { id: "deepseek-v3.2:cloud", label: "deepseek-v3.2", provider: "ollama" },
      { id: "qwen3.5:397b-cloud", label: "qwen3.5 397b", provider: "ollama" },
      { id: "qwen3-coder:480b-cloud", label: "qwen3-coder 480b", provider: "ollama" },
      { id: "kimi-k2.5:cloud", label: "kimi-k2.5", provider: "ollama" },
      { id: "mistral-large-3:675b-cloud", label: "mistral-large-3 675b", provider: "ollama" },
      { id: "gemma4:31b-cloud", label: "gemma4 31b", provider: "ollama" },
      { id: "nemotron-3-super:cloud", label: "nemotron-3-super", provider: "ollama" },
    ],
  },
  {
    label: "Anthropic",
    models: [
      { id: "anthropic:claude-sonnet-4-6", label: "claude-sonnet-4-6", provider: "anthropic" },
      { id: "anthropic:claude-haiku-4-5-20251001", label: "claude-haiku-4.5", provider: "anthropic" },
      { id: "anthropic:claude-opus-4-6", label: "claude-opus-4-6", provider: "anthropic" },
    ],
  },
  {
    label: "Mistral",
    models: [
      { id: "mistral:mistral-large-latest", label: "mistral-large", provider: "mistral" as const },
      { id: "mistral:mistral-small-latest", label: "mistral-small", provider: "mistral" as const },
      { id: "mistral:codestral-latest", label: "codestral", provider: "mistral" as const },
      { id: "mistral:devstral-small-latest", label: "devstral-small", provider: "mistral" as const },
    ],
  },
  {
    label: "OpenAI",
    models: [
      { id: "openai:gpt-5.5", label: "gpt-5.5", provider: "openai" },
      { id: "openai:gpt-5.4", label: "gpt-5.4", provider: "openai" },
      { id: "openai:gpt-5.3-codex", label: "gpt-5.3-codex", provider: "openai" },
      { id: "openai:gpt-4.1", label: "gpt-4.1", provider: "openai" },
      { id: "openai:gpt-4.1-mini", label: "gpt-4.1-mini", provider: "openai" },
      { id: "openai:gpt-4.1-nano", label: "gpt-4.1-nano", provider: "openai" },
      { id: "openai:o3", label: "o3", provider: "openai" },
      { id: "openai:o4-mini", label: "o4-mini", provider: "openai" },
    ],
  },
]

const STORAGE_KEY = "kalit_admin_model"
const TASKFORCE_STORAGE_KEY = "kalit_admin_taskforce_standard"

const TASKFORCE_STANDARDS: {
  id: TaskforceStandard
  label: string
  shortLabel: string
  provider: "anthropic" | "openai"
}[] = [
  { id: "anthropic", label: "Claude Taskforce", shortLabel: "TF: Claude", provider: "anthropic" },
  { id: "openai", label: "GPT Taskforce", shortLabel: "TF: GPT", provider: "openai" },
]

function isTaskforceStandard(value: string | null): value is TaskforceStandard {
  return value === "anthropic" || value === "openai"
}

export function ModelSelector() {
  const user = useStudioUser()
  const selectedModel = useStudioStore((st) => st.selectedModel)
  const setSelectedModel = useStudioStore((st) => st.setSelectedModel)
  const taskforceStandard = useStudioStore((st) => st.taskforceStandard)
  const setTaskforceStandard = useStudioStore((st) => st.setTaskforceStandard)
  const [open, setOpen] = useState<"model" | "taskforce" | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setSelectedModel(saved)
      const savedTaskforce = localStorage.getItem(TASKFORCE_STORAGE_KEY)
      if (isTaskforceStandard(savedTaskforce)) setTaskforceStandard(savedTaskforce)
    } catch { /* noop */ }
  }, [setSelectedModel, setTaskforceStandard])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null)
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  if (!user?.isAdmin) return null

  const current = MODEL_GROUPS.flatMap((g) => g.models).find((m) => m.id === selectedModel)
  const displayLabel = current?.label ?? selectedModel

  function handleSelect(modelId: string) {
    setSelectedModel(modelId)
    try { localStorage.setItem(STORAGE_KEY, modelId) } catch { /* noop */ }
    setOpen(null)
  }

  const currentTaskforce = TASKFORCE_STANDARDS.find((item) => item.id === taskforceStandard)
    ?? TASKFORCE_STANDARDS[0]

  function handleTaskforceSelect(standard: TaskforceStandard) {
    setTaskforceStandard(standard)
    try { localStorage.setItem(TASKFORCE_STORAGE_KEY, standard) } catch { /* noop */ }
    setOpen(null)
  }

  return (
    <div className={s.selectorGroup} ref={ref}>
      <div className={s.wrapper}>
        <button
          type="button"
          className={s.trigger}
          onClick={() => setOpen(open === "model" ? null : "model")}
          title={`Model: ${selectedModel}`}
        >
          <span className={s.dot} data-provider={current?.provider ?? "ollama"} />
          <span className={s.label}>{displayLabel}</span>
          <span className={s.chevron} data-open={open === "model"}>▾</span>
        </button>

        {open === "model" && (
          <div className={s.dropdown}>
            {MODEL_GROUPS.map((group) => (
              <div key={group.label} className={s.group}>
                <div className={s.groupLabel}>{group.label}</div>
                {group.models.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    className={s.item}
                    data-active={model.id === selectedModel}
                    onClick={() => handleSelect(model.id)}
                  >
                    <span className={s.dot} data-provider={model.provider} />
                    <span className={s.modelName}>{model.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={s.wrapper}>
        <button
          type="button"
          className={s.trigger}
          onClick={() => setOpen(open === "taskforce" ? null : "taskforce")}
          title={`Taskforce: ${currentTaskforce.label}`}
        >
          <span className={s.dot} data-provider={currentTaskforce.provider} />
          <span className={s.label}>{currentTaskforce.shortLabel}</span>
          <span className={s.chevron} data-open={open === "taskforce"}>▾</span>
        </button>

        {open === "taskforce" && (
          <div className={s.dropdown}>
            <div className={s.group}>
              <div className={s.groupLabel}>Taskforce</div>
              {TASKFORCE_STANDARDS.map((standard) => (
                <button
                  key={standard.id}
                  type="button"
                  className={s.item}
                  data-active={standard.id === taskforceStandard}
                  onClick={() => handleTaskforceSelect(standard.id)}
                >
                  <span className={s.dot} data-provider={standard.provider} />
                  <span className={s.modelName}>{standard.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
