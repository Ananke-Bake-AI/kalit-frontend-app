import s from "./footer.module.scss"

export const Newsletter = () => {
  return (
    <div className={s.newsletter}>
      <div className={s.left}>
        <h2>Join our newsletter</h2>
        <p>Subscribe to our newsletter to get the latest news and updates.</p>
      </div>
      <form>
        <input type="email" placeholder="Email" />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  )
}
