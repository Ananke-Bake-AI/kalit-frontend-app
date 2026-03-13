import { Container } from "@/components/container"
import { Heading } from "@/components/heading"
import { Icon } from "@iconify/react"
import Image from "next/image"
import s from "./features.module.scss"

const FEATURES = [
  {
    img: "/img/img1.png",
    title: "A team of high-performing and adaptable AI agents",
    description: "Elite AI agents working in sync. Scale output without scaling your team. Pure power, zero overhead."
  },
  {
    img: "/img/img2.png",
    title: "Describe your project and add your references screenshots & assets",
    description: "Describe it. Add screenshots. Watch it come alive. No coding. No limits. Only results."
  },
  {
    img: "/img/img3.png",
    title: "Simultaneous generation without effort",
    description: "One click. Multiple outputs. Faster iteration. Ship more, worry less. Dominate the market."
  },
  {
    img: "/img/img4.png",
    title: "Publish your landing pages — no skills required",
    description: "From idea to live in minutes. Zero code. Zero friction. Unlimited possibilities. Launch now."
  }
]

export const Features = () => {
  return (
    <section className={s.features}>
      <Container>
        <Heading
          className={s.heading}
          subtitle="Our Features"
          paragraph="The most powerful AI platform. Ship world-class apps in minutes, not months."
        >
          Tailored AI features
          <br /> for maximum{" "}
          <span data-icon="right">
            success
            <span data-icon-svg>
              <Icon icon="hugeicons:chart-up" />
            </span>
          </span>
        </Heading>
        <div className={s.list}>
          {FEATURES.map((feature) => (
            <div className={s.item} key={feature.title} data-reveal>
              <Image src={feature.img} alt={feature.title} width={1314} height={1046} quality={100} draggable={false} />
              <div className={s.content}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
