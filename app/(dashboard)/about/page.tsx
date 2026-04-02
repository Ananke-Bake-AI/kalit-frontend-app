import { Container } from "@/components/container"
import { Icon } from "@/components/icon"
import { Logo } from "@/components/logo"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { PageSection } from "@/components/page-section"
import s from "./about.module.scss"

export const metadata: Metadata = {
  title: "About Us — Kalit AI",
  description:
    "Meet the team behind Kalit AI. Experienced engineers and entrepreneurs building the AI execution platform for startups and digital teams.",
}

const FOUNDERS = [
  {
    name: "Frederick Marinho",
    role: "Co-Founder & CEO",
    photo: "/img/founders/frederick.jpeg",
    bio: "Full-stack engineer and serial entrepreneur with deep roots in blockchain infrastructure and decentralized systems. Co-founded Helios Blockchain and managed Merkle Tech Capital. Brings a decade of experience shipping products across crypto, fintech, and AI.",
    companies: ["Helios Blockchain", "Merkle Tech Capital", "GraphLinq", "Kryxivia"],
    linkedin: "https://www.linkedin.com/in/frederick-marinho/"
  },
  {
    name: "Jeremy Guyet",
    role: "Co-Founder & CTO",
    photo: "/img/founders/jeremy.jpg",
    bio: "Systems architect and technical leader with production experience at AXA, Canal+, and Samsung (via Artefact). Co-founded Checkdot and Kryxivia. Expert in distributed systems, Kubernetes, and building scalable platforms. Angular trainer at Ambient IT.",
    companies: ["AXA", "Canal+", "Checkdot", "Kryxivia", "Ambient IT"],
    linkedin: "https://www.linkedin.com/in/jeremy-guyet/"
  },
  {
    name: "Nicolas Martins",
    role: "Co-Founder & Lead Engineer",
    photo: "/img/founders/nicolas.jpg",
    bio: "Senior backend architect with 6+ years leading engineering at Cityscoot — scaling infrastructure for hundreds of thousands of users. Expert in Kubernetes, microservices, Go, and cloud systems. Previously built tools for RATP and enterprise clients.",
    companies: ["Cityscoot", "RATP", "Telys", "Groupe AB"],
    linkedin: "https://www.linkedin.com/in/nicolas-martins/"
  }
]

const VALUES = [
  {
    icon: "hugeicons:rocket-01",
    title: "Ship to production",
    description: "Every feature we build is designed to deliver real outcomes — not demos or prototypes."
  },
  {
    icon: "hugeicons:cpu",
    title: "AI as infrastructure",
    description: "We orchestrate the best models into execution workflows — not another chatbot wrapper."
  },
  {
    icon: "hugeicons:shield-01",
    title: "Trust by default",
    description: "Registered company, real team, transparent practices. Your data stays yours."
  },
  {
    icon: "hugeicons:chart-breakout-circle",
    title: "Scale from day one",
    description: "Built on enterprise patterns — from Kubernetes to distributed systems — because startups deserve enterprise-grade tools."
  }
]

export default function AboutPage() {
  return (
    <PageSection>
      <Container>
        <PageHeader
          title="Built by engineers who ship."
          description="Kalit is built by a team of experienced engineers and entrepreneurs who've scaled products at companies like Cityscoot, AXA, Canal+, and across the blockchain ecosystem. We're not building another AI wrapper — we're building the execution layer."
        />

        {/* ── Founders ─────────────────────────────── */}

        <div className={s.foundersGrid}>
          {FOUNDERS.map((founder) => (
            <div key={founder.name} className={s.founderCard}>
              <div className={s.photoWrap}>
                <Image
                  src={founder.photo}
                  alt={founder.name}
                  width={400}
                  height={400}
                  className={s.photo}
                  quality={90}
                />
                <div className={s.photoOverlay} />
              </div>
              <div className={s.founderBody}>
                <div className={s.founderTop}>
                  <h3 className={s.founderName}>{founder.name}</h3>
                  <span className={s.founderRole}>{founder.role}</span>
                </div>
                <p className={s.founderBio}>{founder.bio}</p>
                <div className={s.companies}>
                  {founder.companies.map((c) => (
                    <span key={c} className={s.company}>{c}</span>
                  ))}
                </div>
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.linkedinLink}
                >
                  <Icon icon="hugeicons:linkedin-01" />
                  LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ── Values ──────────────────────────────── */}

        <h2 className={s.sectionTitle}>What drives us</h2>
        <div className={s.valuesGrid}>
          {VALUES.map((value) => (
            <div key={value.title} className={s.valueCard}>
              <div className={s.valueIcon}>
                <Icon icon={value.icon} />
              </div>
              <h3 className={s.valueTitle}>{value.title}</h3>
              <p className={s.valueDesc}>{value.description}</p>
            </div>
          ))}
        </div>

        {/* ── Company ────────────────────────────── */}

        <div className={s.companySection}>
          <div className={s.companyContent}>
            <div className={s.companyLogo}>
              <Logo id="kalit" />
            </div>
            <div>
              <h2 className={s.companyTitle}>Merkle Tech Labs LTD.</h2>
              <p className={s.companySubtitle}>The company behind Kalit AI</p>
            </div>
          </div>

          <div className={s.companyGrid}>
            <div className={s.companyItem}>
              <span className={s.companyLabel}>Registration</span>
              <span className={s.companyValue}>C 107851</span>
            </div>
            <div className={s.companyItem}>
              <span className={s.companyLabel}>Incorporated</span>
              <span className={s.companyValue}>February 2024</span>
            </div>
            <div className={s.companyItem}>
              <span className={s.companyLabel}>Jurisdiction</span>
              <span className={s.companyValue}>Malta</span>
            </div>
            <div className={s.companyItem}>
              <span className={s.companyLabel}>Registered office</span>
              <span className={s.companyValue}>
                Northlink Business Centre, Level 2<br />
                Triq Burmarrad, Naxxar, NXR 6345<br />
                Malta
              </span>
            </div>
          </div>

          <div className={s.companyContact}>
            <a href="mailto:contact@kalit.ai" className={s.contactLink}>
              <Icon icon="hugeicons:mail-01" />
              contact@kalit.ai
            </a>
            <a href="https://x.com/kalit_ai" target="_blank" rel="noopener noreferrer" className={s.contactLink}>
              <Icon icon="hugeicons:new-twitter" />
              @kalit_ai
            </a>
            <a href="https://www.linkedin.com/company/kalit-ai" target="_blank" rel="noopener noreferrer" className={s.contactLink}>
              <Icon icon="hugeicons:linkedin-01" />
              LinkedIn
            </a>
            <a href="https://discord.gg/kalit-ai" target="_blank" rel="noopener noreferrer" className={s.contactLink}>
              <Icon icon="hugeicons:discord" />
              Discord
            </a>
          </div>
        </div>
      </Container>
    </PageSection>
  )
}
