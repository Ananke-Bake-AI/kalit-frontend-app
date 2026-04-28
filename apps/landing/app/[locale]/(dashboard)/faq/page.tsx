import { Container } from "@/components/container"
import clsx from "clsx"
import { PageHeader } from "@/components/page-header"
import { PageSection } from "@/components/page-section"
import { isValidLocale, type Locale } from "@/lib/i18n"
import { getServerTranslation, getTranslationForLocale } from "@/lib/i18n-server"
import { MetadataSeo } from "@/lib/metadata"
import legal from "@/components/legal-document/legal-document.module.scss"
import s from "./faq.module.scss"

const FAQ_IDS = ["1", "2", "3", "4", "5", "6"]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isValidLocale(raw) ? (raw as Locale) : "en"
  const t = await getTranslationForLocale(locale)
  return MetadataSeo({
    fullTitle: t("faqPage.metaTitle"),
    description: t("faqPage.metaDescription"),
    locale,
    pathname: "/faq"
  })
}

export default async function FAQPage() {
  const { t } = await getServerTranslation()
  const faqs = FAQ_IDS.map((id) => ({
    question: t(`faqPage.items.${id}.question`),
    answer: t(`faqPage.items.${id}.answer`)
  }))

  return (
    <PageSection>
      <Container>
        <PageHeader
          title={t("faqPage.title")}
          description={t("faqPage.description")}
        />

        <div className={clsx(legal.surface, legal.narrow, s.list)}>
          {faqs.map((faq, index) => (
            <details key={index} name="faq">
              <summary className={s.summary}>{faq.question}</summary>
              <p className={s.answer}>{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </PageSection>
  )
}
