import { Button } from "@/components/button"
import { Container } from "@/components/container"
import { Icon } from "@/components/icon"
import { Logo } from "@/components/logo"
import { isValidLocale, type Locale } from "@/lib/i18n"
import { getServerTranslation, getTranslationForLocale } from "@/lib/i18n-server"
import { MetadataSeo } from "@/lib/metadata"
import s from "./search.module.scss"

export const viewport = {
  themeColor: "#8B5CF6"
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isValidLocale(raw) ? (raw as Locale) : "en"
  const t = await getTranslationForLocale(locale)
  return MetadataSeo({
    fullTitle: t("seo.searchTitle"),
    description: t("seo.searchDescription"),
    image: "/img/thumbnail.jpg",
    locale,
    pathname: "/search"
  })
}

export default async function SearchPage() {
  const { t } = await getServerTranslation()

  const cards = [
    {
      icon: "hugeicons:search-01",
      title: t("searchLanding.card1Title"),
      text: t("searchLanding.card1Text")
    },
    {
      icon: "hugeicons:chart-evaluation",
      title: t("searchLanding.card2Title"),
      text: t("searchLanding.card2Text")
    },
    {
      icon: "hugeicons:rocket-01",
      title: t("searchLanding.card3Title"),
      text: t("searchLanding.card3Text")
    }
  ]

  const signals = [
    t("searchLanding.signal1"),
    t("searchLanding.signal2"),
    t("searchLanding.signal3")
  ]

  const steps = [
    {
      number: "01",
      title: t("searchLanding.step1Title"),
      text: t("searchLanding.step1Text")
    },
    {
      number: "02",
      title: t("searchLanding.step2Title"),
      text: t("searchLanding.step2Text")
    },
    {
      number: "03",
      title: t("searchLanding.step3Title"),
      text: t("searchLanding.step3Text")
    }
  ]

  return (
    <section className={s.page}>
      <Container className={s.container}>
        <div className={s.heroGrid}>
          <div className={s.hero}>
            <div className={s.logo}>
              <Logo id="search" />
            </div>
            <p className={s.kicker}>{t("searchLanding.kicker")}</p>
            <h1>{t("searchLanding.title")}</h1>
            <p className={s.description}>{t("searchLanding.description")}</p>
            <div className={s.actions}>
              <Button href="/search/open" icon="hugeicons:arrow-right-02">
                {t("searchLanding.cta")}
              </Button>
              <Button href="/register" variant="secondary">
                {t("searchLanding.secondaryCta")}
              </Button>
            </div>
          </div>

          <div className={s.preview} aria-label={t("searchLanding.previewTitle")}>
            <div className={s.previewTop}>
              <div>
                <span>{t("searchLanding.previewEyebrow")}</span>
                <strong>{t("searchLanding.previewTitle")}</strong>
              </div>
              <Icon icon="hugeicons:ai-search-02" />
            </div>
            <div className={s.query}>
              <span>{t("searchLanding.previewQueryLabel")}</span>
              <p>{t("searchLanding.previewQuery")}</p>
            </div>
            <div className={s.signalList}>
              {signals.map((signal) => (
                <div className={s.signal} key={signal}>
                  <Icon icon="hugeicons:tick-02" />
                  <span>{signal}</span>
                </div>
              ))}
            </div>
            <div className={s.output}>
              <span>{t("searchLanding.outputLabel")}</span>
              <p>{t("searchLanding.outputText")}</p>
            </div>
          </div>
        </div>

        <div className={s.cards}>
          {cards.map((card) => (
            <article className={s.card} key={card.title}>
              <Icon icon={card.icon} />
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </article>
          ))}
        </div>

        <div className={s.workflow}>
          <div className={s.workflowIntro}>
            <span>{t("searchLanding.workflowEyebrow")}</span>
            <h2>{t("searchLanding.workflowTitle")}</h2>
          </div>
          <div className={s.steps}>
            {steps.map((step) => (
              <div className={s.step} key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
