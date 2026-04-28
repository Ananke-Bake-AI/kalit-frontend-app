import { Container } from "@/components/container"
import clsx from "clsx"
import { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { PageSection } from "@/components/page-section"
import legal from "@/components/legal-document/legal-document.module.scss"
import s from "./faq.module.scss"

export const metadata: Metadata = {
  title: "FAQ - Kalit AI",
  description: "Frequently asked questions about the Kalit AI platform.",
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
      "We offer three paid plans: Starter, Pro, and Enterprise. Starter includes Kalit Flow with 100 credits per month for 2 team members. Pro includes Flow, Project, and Marketing with 500 credits per month for 10 team members. Enterprise includes all 4 suites with 2,000 credits per month, unlimited team members, priority execution, pentest scanning, and custom integrations. Visit our pricing page for current details.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. You can create an account and explore Kalit before upgrading to a paid plan. If you want to evaluate higher-capacity features, contact us and we can guide you to the right plan or trial path.",
  },
  {
    question: "How does Kalit AI handle data security?",
    answer:
      "We take security seriously. All data is encrypted in transit (TLS) and at rest. We follow industry best practices including regular security audits, role-based access controls, and strict data isolation between accounts. We do not use your data to train AI models unless you explicitly opt in. For more details, see our Privacy Policy.",
  },
  {
    question: "Can I collaborate with my team?",
    answer:
      "Absolutely. Starter includes 2 team members, Pro includes 10 team members, and Enterprise includes unlimited members. Teams can collaborate through shared workspaces, member management, shared suite configurations, and centralized billing.",
  },
  {
    question: "Which platforms and integrations are supported?",
    answer:
      "Kalit AI is a web-based platform accessible from any modern browser on desktop, tablet, or mobile. We also provide API and integration support depending on plan. Pro includes production deployment support, and Enterprise adds custom integrations and dedicated support for advanced workflows.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "You can cancel your subscription at any time from your account settings. When you cancel, you retain access to your paid plan features until the end of your current billing period. After that, your account reverts to the Free tier. We do not charge cancellation fees. If you need a refund, contact us at contact@kalit.ai within 14 days of the charge.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply create an account on our website. No credit card required. Once signed in, you can explore available suites from your dashboard, run your first tasks using the Free tier credits, and upgrade to a paid plan whenever you need more capacity.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We provide email support at contact@kalit.ai for all users. Starter includes email support, Pro includes priority support, and Enterprise includes dedicated support. We also have a Discord community where you can connect with other users, share tips, and get help. Visit our Support page for all contact options.",
  },
]

export default function FAQPage() {
  return (
    <PageSection>
      <Container>
        <PageHeader
          title="Frequently Asked Questions"
          description="Find answers to common questions about Kalit AI. If you need further help, reach out to our support team."
        />

        <div className={clsx(legal.surface, legal.narrow, s.list)}>
          {faqs.map((faq, index) => (
            <details key={index} name="faq">
              <summary className={s.summary}>{faq.question}</summary>
              <p className={s.answer}>{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </PageSection>
  )
}
