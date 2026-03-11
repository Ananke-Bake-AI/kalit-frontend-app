import Link from "next/link"
import s from "./nav.module.scss"

export const Nav = () => {
  return (
    <nav className={s.nav}>
      <ul>
        <li>
          <Link href="/" className={s.link}>
            Suites
          </Link>
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
