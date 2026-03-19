import { Container } from "@/components/container"
import { Metadata } from "next"
import s from "../app.module.scss"

export const metadata: Metadata = {
  title: "Terms of Service — Kalit AI",
  description: "Terms of Service for the Kalit AI platform.",
}

const sectionHeading: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "1.35rem",
  color: "var(--text)",
  marginTop: "2.5rem",
  marginBottom: "0.75rem",
}

const subHeading: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "1.1rem",
  color: "var(--text)",
  marginTop: "1.5rem",
  marginBottom: "0.5rem",
}

const paragraph: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: "0.95rem",
  lineHeight: 1.7,
  marginBottom: "0.75rem",
}

const list: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: "0.95rem",
  lineHeight: 1.7,
  paddingLeft: "1.5rem",
  marginBottom: "0.75rem",
}

export default function TermsOfServicePage() {
  return (
    <section className={s.page}>
      <Container>
        <header className={s.pageHeader}>
          <h1>Terms of Service</h1>
          <p>Last updated: March 19, 2026</p>
        </header>

        <div className={s.panel} style={{ maxWidth: "52rem", margin: "0 auto" }}>
          <p style={paragraph}>
            Welcome to Kalit AI. These Terms of Service (&quot;Terms&quot;) govern your access to and
            use of the Kalit AI platform, website, and services (collectively, the
            &quot;Service&quot;). By accessing or using the Service, you agree to be bound by these
            Terms. If you do not agree, do not use the Service.
          </p>

          <h2 style={sectionHeading}>1. Acceptance of Terms</h2>
          <p style={paragraph}>
            By creating an account, accessing, or using the Service, you acknowledge that you have
            read, understood, and agree to be bound by these Terms and our Privacy Policy. If you are
            using the Service on behalf of an organization, you represent and warrant that you have
            the authority to bind that organization to these Terms.
          </p>

          <h2 style={sectionHeading}>2. Description of Service</h2>
          <p style={paragraph}>
            Kalit AI provides a software-as-a-service (SaaS) platform that offers AI-powered tools
            and suites for automation, analysis, and workflow optimization. The Service includes
            access to AI models, dashboards, APIs, and related features as described on our website.
            We reserve the right to modify, suspend, or discontinue any part of the Service at any
            time with reasonable notice.
          </p>

          <h2 style={sectionHeading}>3. User Accounts</h2>
          <p style={paragraph}>
            To access certain features of the Service, you must create an account. You agree to:
          </p>
          <ul style={list}>
            <li>Provide accurate, current, and complete information during registration.</li>
            <li>Maintain the security and confidentiality of your login credentials.</li>
            <li>Notify us immediately of any unauthorized use of your account.</li>
            <li>
              Accept responsibility for all activities that occur under your account.
            </li>
          </ul>
          <p style={paragraph}>
            We reserve the right to suspend or terminate accounts that violate these Terms or that
            have been inactive for an extended period.
          </p>

          <h2 style={sectionHeading}>4. Acceptable Use</h2>
          <p style={paragraph}>You agree not to use the Service to:</p>
          <ul style={list}>
            <li>Violate any applicable law, regulation, or third-party rights.</li>
            <li>
              Upload, transmit, or distribute any content that is unlawful, harmful, threatening,
              abusive, defamatory, or otherwise objectionable.
            </li>
            <li>
              Attempt to gain unauthorized access to any part of the Service, other accounts, or
              computer systems.
            </li>
            <li>
              Interfere with or disrupt the integrity or performance of the Service or its
              infrastructure.
            </li>
            <li>
              Reverse engineer, decompile, or disassemble any aspect of the Service.
            </li>
            <li>
              Use the Service to develop a competing product or service.
            </li>
            <li>
              Use automated means (bots, scrapers) to access the Service beyond the scope of our
              APIs.
            </li>
          </ul>

          <h2 style={sectionHeading}>5. Intellectual Property</h2>
          <p style={paragraph}>
            The Service, including its original content, features, and functionality, is owned by
            Kalit AI and is protected by international copyright, trademark, patent, trade secret,
            and other intellectual property laws.
          </p>
          <h3 style={subHeading}>Your Content</h3>
          <p style={paragraph}>
            You retain ownership of any data, text, or materials you submit to the Service
            (&quot;Your Content&quot;). By uploading Your Content, you grant Kalit AI a limited,
            non-exclusive license to process, store, and display Your Content solely for the purpose
            of providing the Service to you.
          </p>
          <h3 style={subHeading}>AI-Generated Output</h3>
          <p style={paragraph}>
            Output generated by the Service using your inputs belongs to you, subject to any
            applicable third-party rights and our Acceptable Use policy. Kalit AI does not claim
            ownership of AI-generated output produced from your prompts or data.
          </p>

          <h2 style={sectionHeading}>6. Payment and Billing</h2>
          <p style={paragraph}>
            Certain features of the Service require a paid subscription. By subscribing to a paid
            plan, you agree to:
          </p>
          <ul style={list}>
            <li>
              Pay all fees associated with your selected plan in accordance with the pricing
              published at the time of purchase.
            </li>
            <li>
              Provide valid and up-to-date payment information. Payments are processed securely
              through our third-party payment provider (Stripe).
            </li>
            <li>
              Subscriptions renew automatically at the end of each billing cycle unless cancelled
              before the renewal date.
            </li>
          </ul>
          <p style={paragraph}>
            Refunds are handled on a case-by-case basis. If you believe you have been charged in
            error, please contact us at contact@kalit.ai within 14 days of the charge.
          </p>

          <h2 style={sectionHeading}>7. Limitation of Liability</h2>
          <p style={paragraph}>
            To the maximum extent permitted by applicable law, Kalit AI and its officers, directors,
            employees, and agents shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, including but not limited to loss of profits, data,
            use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul style={list}>
            <li>Your access to or use of (or inability to access or use) the Service.</li>
            <li>Any conduct or content of any third party on the Service.</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
          </ul>
          <p style={paragraph}>
            In no event shall Kalit AI&apos;s total liability to you exceed the amount you have paid
            to Kalit AI in the twelve (12) months preceding the claim.
          </p>

          <h2 style={sectionHeading}>8. Disclaimers</h2>
          <p style={paragraph}>
            The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without
            warranties of any kind, whether express or implied, including but not limited to implied
            warranties of merchantability, fitness for a particular purpose, and non-infringement.
            Kalit AI does not warrant that the Service will be uninterrupted, error-free, or secure.
          </p>

          <h2 style={sectionHeading}>9. Termination</h2>
          <p style={paragraph}>
            We may terminate or suspend your access to the Service immediately, without prior notice
            or liability, for any reason, including if you breach these Terms. Upon termination, your
            right to use the Service will cease immediately. You may terminate your account at any
            time by contacting us or using the account deletion feature in your settings.
          </p>
          <p style={paragraph}>
            Upon termination, we will make your data available for export for a period of 30 days,
            after which it may be permanently deleted.
          </p>

          <h2 style={sectionHeading}>10. Governing Law</h2>
          <p style={paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of France,
            without regard to its conflict of law provisions. Any disputes arising from or relating
            to these Terms or the Service shall be subject to the exclusive jurisdiction of the
            courts located in Paris, France.
          </p>

          <h2 style={sectionHeading}>11. Changes to Terms</h2>
          <p style={paragraph}>
            We reserve the right to modify these Terms at any time. If we make material changes, we
            will notify you by email or by posting a notice on the Service at least 30 days before
            the changes take effect. Your continued use of the Service after the effective date of
            the revised Terms constitutes your acceptance of the changes.
          </p>

          <h2 style={sectionHeading}>12. Contact</h2>
          <p style={paragraph}>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p style={paragraph}>
            <strong style={{ color: "var(--text)" }}>Kalit AI</strong>
            <br />
            Email:{" "}
            <a href="mailto:contact@kalit.ai" style={{ color: "var(--color-4)" }}>
              contact@kalit.ai
            </a>
          </p>
        </div>
      </Container>
    </section>
  )
}
