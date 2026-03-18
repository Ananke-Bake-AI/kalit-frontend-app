"use client"

import { Button } from "@/components/button"
import { Container } from "@/components/container"
import { register } from "@/server/actions/auth"
import clsx from "clsx"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import s from "../auth.module.scss"

const audiences = [
  { title: "Founders", text: "Turn an idea into product, site, and growth faster." },
  { title: "Non-technical teams", text: "Use Kalit to launch without hiring a full team first." },
  { title: "Developers", text: "Move faster on apps, workflows, and execution." },
]

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await register({ name, email, password })

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (signInResult?.error) {
      toast.error("Account created. Please sign in.")
      router.push("/login")
      return
    }

    router.push("/setup")
    router.refresh()
  }

  const handleOAuth = async (provider: string) => {
    await signIn(provider, { callbackUrl: "/setup" })
  }

  return (
    <section className={s.page}>
      <Container>
        <div className={s.shell}>
          <div className={s.showcase}>
            <div className={s.showcaseHeader}>
              <span className={s.kicker}>Get started</span>
              <h1>Bring your idea to market with Kalit.</h1>
              <p>Create an account, set up your workspace, and choose the suite that fits your goal.</p>
            </div>

            <div className={s.highlights}>
              {audiences.map((item) => (
                <div key={item.title} className={s.highlight}>
                  <div className={s.highlightTitle}>
                    <span>{item.title}</span>
                  </div>
                  <p className={s.highlightText}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={s.card}>
            <div className={s.header}>
              <h1>Create account</h1>
              <p>Free to start. Choose your workspace and first suite after signup.</p>
            </div>

            <form onSubmit={handleSubmit} className={clsx(s.form, loading && s.loading)}>
              <div className={s.field}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={s.field}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={s.field}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <div className={s.submit}>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </div>

              <div className={s.divider}>
                <span>or continue with</span>
              </div>

              <div className={s.oauth}>
                <Button type="button" variant="secondary" onClick={() => handleOAuth("google")}>
                  Google
                </Button>
                <Button type="button" variant="secondary" onClick={() => handleOAuth("github")}>
                  GitHub
                </Button>
              </div>

              <p className={s.footer}>
                Already have an account? <Link href="/login">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </Container>
    </section>
  )
}
