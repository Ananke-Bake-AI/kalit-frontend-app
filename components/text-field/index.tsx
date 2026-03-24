"use client"

import clsx from "clsx"
import { forwardRef, type InputHTMLAttributes } from "react"
import s from "./text-field.module.scss"

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  dense?: boolean
  variant?: "default" | "danger"
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, id, error, dense, variant = "default", className, ...props }, ref) => {
    return (
      <div className={clsx(s.root, className)}>
        {label ? (
          <label className={s.label} htmlFor={id}>
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={id}
          className={clsx(
            s.input,
            dense && s.inputDense,
            variant === "danger" && s.inputDanger
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {error ? <p className={s.error}>{error}</p> : null}
      </div>
    )
  }
)

TextField.displayName = "TextField"
