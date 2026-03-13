import { Container } from "@/components/container"
import { Logotype } from "@/components/logotype"
import Link from "next/link"
import s from "./footer.module.scss"
import { Newsletter } from "./newsletter"

const NAVS = [
  {
    title: "Suites",
    links: [
      {
        title: "Pentest",
        href: "/pentest"
      },
      {
        title: "Flow",
        href: "/flow"
      },
      {
        title: "Marketing",
        href: "/marketing"
      },
      {
        title: "Project",
        href: "/project"
      }
    ]
  },
  {
    title: "Resources",
    links: [
      {
        title: "FAQ",
        href: "/faq"
      },
      {
        title: "Support",
        href: "/support"
      },
      {
        title: "Documentation",
        href: "/documentation"
      },
      {
        title: "GitHub",
        href: "/github"
      }
    ]
  },
  {
    title: "Company",
    links: [
      {
        title: "Careers",
        href: "/careers"
      },
      {
        title: "Contact Us",
        href: "/contact-us"
      },
      {
        title: "Branding Kit",
        href: "/branding-kit"
      }
    ]
  }
]

export const Footer = () => {
  return (
    <footer className={s.footer}>
      <Container className={s.container}>
        <div className={s.top}>
          <div className={s.left}>
            <Logotype className={s.logo} />
            <div>
              <p>© 2026. All rights reserved.</p>
            </div>
          </div>
          <div className={s.nav}>
            {NAVS.map((nav) => (
              <div key={nav.title}>
                <h3>{nav.title}</h3>
                <ul>
                  {nav.links.map((link) => (
                    <li key={link.title}>
                      <Link href={link.href}>{link.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Newsletter />
        <div className={s.bottom}>test</div>
      </Container>
    </footer>
  )
}
