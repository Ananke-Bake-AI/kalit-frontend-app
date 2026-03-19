import { Container } from "@/components/container"
import { Metadata } from "next"
import s from "../app.module.scss"

export const metadata: Metadata = {
  title: "Support — Kalit AI",
  description: "Get help and support for the Kalit AI platform.",
}

const cardStyle: React.CSSProperties = {
  padding: "1.5rem",
  borderRadius: "1.15rem",
  border: "1px solid oklch(0 0 0 / 0.06)",
  background: "oklch(1 0 0 / 0.74)",
}

const cardTitle: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "1.15rem",
  color: "var(--text)",
  marginBottom: "0.5rem",
}

const cardText: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: "0.95rem",
  lineHeight: 1.7,
  marginBottom: "1rem",
}

const linkStyle: React.CSSProperties = {
  color: "var(--color-4)",
  fontWeight: 600,
  fontSize: "0.95rem",
  textDecoration: "none",
}

export default function SupportPage() {
  return (
    <section className={s.page}>
      <Container>
        <header className={s.pageHeader}>
          <h1>Support</h1>
          <p>
            We are here to help. Choose the support channel that works best for you.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
            gap: "1.25rem",
            maxWidth: "52rem",
            margin: "0 auto",
          }}
        >
          <div style={cardStyle}>
            <h2 style={cardTitle}>Email Support</h2>
            <p style={cardText}>
              Reach our support team directly by email. We aim to respond within 24 hours on
              business days. Pro and Team plan users receive priority support.
            </p>
            <a href="mailto:contact@kalit.ai" style={linkStyle}>
              contact@kalit.ai
            </a>
          </div>

          <div style={cardStyle}>
            <h2 style={cardTitle}>FAQ</h2>
            <p style={cardText}>
              Browse our frequently asked questions for quick answers to common topics including
              pricing, features, security, and account management.
            </p>
            <a href="/faq" style={linkStyle}>
              View FAQ
            </a>
          </div>

          <div style={cardStyle}>
            <h2 style={cardTitle}>Documentation</h2>
            <p style={cardText}>
              Explore our documentation for detailed guides on getting started, configuring suites,
              using the API, and managing your account.
            </p>
            <a href="/docs" style={linkStyle}>
              Browse Docs
            </a>
          </div>

          <div style={cardStyle}>
            <h2 style={cardTitle}>Discord Community</h2>
            <p style={cardText}>
              Join our Discord server to connect with other Kalit AI users, share tips, get
              community support, and stay updated on new features.
            </p>
            <a
              href="https://discord.gg/kalit-ai"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Join Discord
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
