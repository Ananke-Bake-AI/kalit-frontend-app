import { Link } from "@/components/link"
import { Logo } from "@/components/logo"
import { SUITES } from "@/lib/suites"
import s from "./nav.module.scss"

export const Nav = () => {
  return (
    <nav className={s.nav}>
      <ul>
        <li className={s.subnav}>
          <span className={s.link}>Suites</span>
          <ul className={s.sub}>
            {SUITES.map(({ id, title, color, smallDescription }) => (
              <li key={id} style={{ "--color": color } as React.CSSProperties}>
                <Link href={`/${id}`}>
                  <div className={s.logo}>
                    <Logo id={id} />
                  </div>
                  <span className={s.content}>
                    <strong>{title}</strong>
                    <p>{smallDescription}</p>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <Link href="/" className={s.link}>
            How it works
          </Link>
        </li>
        <li>
          <Link href="/" className={s.link}>
            Try now
          </Link>
        </li>
        <li>
          <Link href="/" className={s.link}>
            Why Kalit?
          </Link>
        </li>
      </ul>
    </nav>
  )
}
