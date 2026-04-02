"use client"

import { Button } from "@/components/button"
import { SurfacePanel } from "@/components/surface-panel"
import { TextField } from "@/components/text-field"
import { useState } from "react"
import { toast } from "sonner"
import s from "./contact.module.scss"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Something went wrong.")
      } else {
        toast.success("Message sent! We'll get back to you soon.")
        setSent(true)
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <SurfacePanel spaced>
        <div className={s.success}>
          <div className={s.successIcon}>✓</div>
          <h3>Message sent</h3>
          <p>Thank you for reaching out. We typically respond within 24 hours.</p>
          <Button variant="secondary" onClick={() => setSent(false)}>
            Send another message
          </Button>
        </div>
      </SurfacePanel>
    )
  }

  return (
    <SurfacePanel spaced title="Send us a message">
      <form onSubmit={handleSubmit} className={s.form}>
        <div className={s.formRow}>
          <TextField
            id="contact-name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            id="contact-email"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <TextField
          id="contact-subject"
          placeholder="Subject (optional)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <div className={s.textareaWrap}>
          <textarea
            id="contact-message"
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            className={s.textarea}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send message"}
        </Button>
      </form>
    </SurfacePanel>
  )
}
