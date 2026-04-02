import { Portfolio } from "@/components/portfolio"
import {
  FlowHeroPrompt,
  SuiteLandingFeatures,
  SuiteLandingHero,
  SuiteLandingHeroStrongLine,
  SuiteLandingHow,
  SuiteLandingPlans
} from "@/components/suite-landing"
import { Underline } from "@/components/underline"
import { getServerTranslation } from "@/lib/i18n-server"
import { MetadataSeo } from "@/lib/metadata"
import { getSuiteById } from "@/lib/suites"
import {
  flowGradientColors,
  flowHeroLine,
  flowHeroList,
  flowHowLine,
  flowMarketingPath,
  flowPlans
} from "./landing-data"

export const viewport = {
  themeColor: "#12BCFF"
}

export const metadata = MetadataSeo({
  fullTitle: "Kalit Flow — Build websites in minutes",
  description:
    "Launch high-converting websites and landing pages in minutes. Design, copy, structure, and hosting included.",
  favicon: "/favicon-flow.svg",
  image: "/img/thumbnail-flow.jpg"
})

export default async function FlowPage() {
  const flowSuite = getSuiteById("flow")
  const suiteAppUrl = flowSuite?.appUrl ?? ""
  const t = await getServerTranslation()

  const heroTitle = t("suiteLanding.flow.heroTitle").split("\n")
  const featTitle = t("suiteLanding.flow.featuresTitle").split("\n")
  const howTitle = t("suiteLanding.flow.howTitle").split("\n")
  const pricingTitle = t("suiteLanding.pricingTitle").split("\n")

  const featureCards = [
    { img: "/img/features/flow1.png", title: t("suiteLanding.flow.feat1Title"), text: t("suiteLanding.flow.feat1Desc"), ctaLabel: t("suiteLanding.getStarted") },
    { img: "/img/features/flow2.png", title: t("suiteLanding.flow.feat2Title"), text: t("suiteLanding.flow.feat2Desc"), ctaLabel: t("suiteLanding.tryFree") },
    { img: "/img/features/flow3.png", title: t("suiteLanding.flow.feat3Title"), text: t("suiteLanding.flow.feat3Desc"), ctaLabel: t("suiteLanding.learnMore") },
    { img: "/img/features/flow4.png", title: t("suiteLanding.flow.feat4Title"), text: t("suiteLanding.flow.feat4Desc"), ctaLabel: t("suiteLanding.getStarted") }
  ]

  return (
    <>
      <SuiteLandingHero
        suiteAppUrl={suiteAppUrl}
        marketingPath={flowMarketingPath}
        gradientColors={flowGradientColors}
        headingTag="h1"
        headingSubtitle={t("suiteLanding.flow.heroSubtitle")}
        headingParagraph={t("suiteLanding.flow.heroParagraph")}
        headingTitle={
          <>
            {heroTitle[0]} <br />
            <SuiteLandingHeroStrongLine line={flowHeroLine}>{heroTitle[1] || "Instantly"}</SuiteLandingHeroStrongLine>
          </>
        }
        listItems={flowHeroList}
        ctaLabel={t("suiteLanding.getStarted")}
        rightSlot={<FlowHeroPrompt suiteAppUrl={suiteAppUrl} marketingPath={flowMarketingPath} />}
      />
      <SuiteLandingFeatures
        suiteAppUrl={suiteAppUrl}
        marketingPath={flowMarketingPath}
        headingSubtitle={t("suiteLanding.flow.featuresSubtitle")}
        headingParagraph={t("suiteLanding.flow.featuresParagraph")}
        headingTitle={<>{featTitle[0]}<br />{featTitle[1]}</>}
        cards={featureCards}
      />
      <SuiteLandingHow
        accent={2}
        lineStroke={flowHowLine.strokeUrl}
        lineD={flowHowLine.d}
        lineViewBox={flowHowLine.viewBox}
        headingSubtitle={t("suiteLanding.howItWorks")}
        headingParagraph={t("suiteLanding.flow.howParagraph")}
        headingTitle={<>{howTitle[0]}<br />{howTitle[1]}</>}
        steps={[
          { icon: "hugeicons:pencil-edit-02", number: 1, title: t("suiteLanding.flow.step1Title"), description: t("suiteLanding.flow.step1Desc") },
          { icon: "hugeicons:ai-generative", number: 2, title: t("suiteLanding.flow.step2Title"), description: t("suiteLanding.flow.step2Desc") },
          { icon: "hugeicons:cloud-download", number: 3, title: t("suiteLanding.flow.step3Title"), description: t("suiteLanding.flow.step3Desc") }
        ]}
        poweredTitle={t("suiteLanding.poweredByAI")}
      />
      <SuiteLandingPlans
        suiteAppUrl={suiteAppUrl}
        marketingPath={flowMarketingPath}
        headingSubtitle={t("suiteLanding.ourPricing")}
        headingParagraph={t("suiteLanding.pricingDesc")}
        headingTitle={<>{pricingTitle.map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</>}
        plans={flowPlans}
      />
      <Portfolio
        subtitle="Sites built with Flow"
        heading={<>From idea to live pages, <br />without the grind</>}
        paragraph={<>Launch <Underline stroke="url(#color-2)">responsive sites</Underline> with AI layout, copy, and structure — ready to publish.</>}
        buttonText={t("suiteLanding.startBuilding")}
        suiteAppUrl={suiteAppUrl}
        marketingPath={flowMarketingPath}
      />
    </>
  )
}
