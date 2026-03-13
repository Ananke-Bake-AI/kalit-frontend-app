import { Button } from "@/components/button"
import s from "./footer.module.scss"

export const Newsletter = () => {
  return (
    <div className={s.newsletter}>
      <div className={s.left}>
        <h2>Join our newsletter</h2>
        <p>Get early access, exclusive tips, and build the future before everyone else.</p>
      </div>
      <form className={s.form}>
        <input type="email" placeholder="Your email address" />
        <Button type="submit">Subscribe</Button>
      </form>
    </div>
  )
}
