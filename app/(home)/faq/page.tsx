import { Container } from "@/components/container"
import { Metadata } from "next"
import s from "../app.module.scss"

export const metadata: Metadata = {
  title: "FAQ — Kalit AI",
  description: "Frequently asked questions about the Kalit AI platform.",
}

const detailsStyle: React.CSSProperties = {
  borderBottom: "1px solid oklch(0 0 0 / 0.06)",
  padding: "1.25rem 0",
}

const summaryStyle: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "1.05rem",
  color: "var(--text)",
  cursor: "pointer",
  listStyle: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
}

const answerStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: "0.95rem",
  lineHeight: 1.7,
  marginTop: "0.75rem",
  paddingRight: "2rem",
}

const faqs = [
  {
    question: "What is Kalit AI?",
    answer:
      "Kalit AI is a SaaS platform that provides AI-powered suites for automation, analysis, and workflow optimization. Our tools help individuals and teams streamline complex tasks using advanced AI models, all accessible through an intuitive web interface.",
  },
  {
    question: "How do suites work?",
    answer:
      "Suites are specialized toolkits designed for specific use cases such as pentesting, content generation, data analysis, and more. Each suite bundles related AI capabilities into a focused workflow. You can access suites from your dashboard, configure them to your needs, and run them on demand or on a schedule.",
  },
  {
    question: "What pricing plans are available?",
    answer:
      "We offer three plans: a Free tier with limited usage for individual users, a Pro plan with expanded limits and priority access for professionals, and a Team plan with collaboration features, shared workspaces, and dedicated support. Visit our pricing page for current details.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. Every new account starts with access to our Free tier, which includes a generous set of credits to explore the platform. No credit card is required to sign up. If you want to try Pro features, we offer a 14-day free trial of the Pro plan.",
  },
  {
    question: "How does Kalit AI handle data security?",
    answer:
      "We take security seriously. All data is encrypted in transit (TLS) and at rest. We follow industry best practices including regular security audits, role-based access controls, and strict data isolation between accounts. We do not use your data to train AI models unless you explicitly opt in. For more details, see our Privacy Policy.",
  },
  {
    question: "Can I collaborate with my team?",
    answer:
      "Absolutely. Our Team plan includes shared workspaces, team member management with role-based permissions, shared suite configurations, and centralized billing. You can invite team members from your dashboard settings and manage access levels for each member.",
  },
  {
    question: "Which platforms and integrations are supported?",
    answer:
      "Kalit AI is a web-based platform accessible from any modern browser on desktop, tablet, or mobile. We also provide a REST API for programmatic access and integrations. Webhook support and third-party integrations (Slack, GitHub, etc.) are available on Pro and Team plans.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "You can cancel your subscription at any time from your account settings. When you cancel, you retain access to your paid plan features until the end of your current billing period. After that, your account reverts to the Free tier. We do not charge cancellation fees. If you need a refund, contact us at contact@kalit.ai within 14 days of the charge.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply create an account on our website — no credit card required. Once signed in, you can explore available suites from your dashboard, run your first tasks using the Free tier credits, and upgrade to a paid plan whenever you need more capacity.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We provide email support at contact@kalit.ai for all users. Pro and Team plan users receive priority response times. We also have a Discord community where you can connect with other users, share tips, and get help. Visit our Support page for all contact options.",
  },
]

export default function FAQPage() {
  return (
    <section className={s.page}>
      <Container>
        <header className={s.pageHeader}>
          <h1>Frequently Asked Questions</h1>
          <p>
            Find answers to common questions about Kalit AI. If you need further help, reach out to
            our support team.
          </p>
        </header>

        <div className={s.panel} style={{ maxWidth: "52rem", margin: "0 auto" }}>
          {faqs.map((faq, index) => (
            <details key={index} style={detailsStyle}>
              <summary style={summaryStyle}>{faq.question}</summary>
              <p style={answerStyle}>{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
