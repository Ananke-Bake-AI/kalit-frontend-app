import { Icon } from "@/components/icon"
import { Link } from "@/components/link"
import { socials } from "@/lib/socials"
import s from "./socials.module.scss"

export const Socials = () => {
  return (
    <ul className={s.socials}>
      {socials.map((social, index) => (
        <li key={index} className={s.item}>
          <Link href={social.url} className={s.link} aria-label={social.name}>
            <Icon icon={social.icon} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
