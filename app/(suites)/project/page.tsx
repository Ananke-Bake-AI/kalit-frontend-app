import { Portfolio } from "@/components/portfolio"
import {
  ProjectHeroPrompt,
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
  projectFeatureCards,
  projectGradientColors,
  projectHeroLine,
  projectHeroList,
  projectHowLine,
  projectMarketingPath,
  projectPlans
} from "./landing-data"
import s from "./project.module.scss"

export const viewport = {
  themeColor: "#8200DF"
}

export const metadata = MetadataSeo({
  fullTitle: "Kalit Project — Build applications with AI",
  description:
    "Build and deploy full applications from a prompt. AI agents plan, build, test, and ship your product end-to-end.",
  favicon: "/favicon-project.svg",
  image: "/img/thumbnail-project.jpg"
})

export default async function ProjectPage() {
  const projectSuite = getSuiteById("project")
  const suiteAppUrl = projectSuite?.appUrl ?? ""
  const t = await getServerTranslation()

  const heroTitle = t("suiteLanding.project.heroTitle").split("\n")
  const featTitle = t("suiteLanding.project.featuresTitle").split("\n")
  const howTitle = t("suiteLanding.project.howTitle").split("\n")
  const pricingTitle = t("suiteLanding.pricingTitle").split("\n")

  return (
    <>
      <SuiteLandingHero
        className={s.hero}
        suiteAppUrl={suiteAppUrl}
        marketingPath={projectMarketingPath}
        gradientColors={projectGradientColors}
        headingTag="h1"
        headingSubtitle={t("suiteLanding.project.heroSubtitle")}
        headingParagraph={t("suiteLanding.project.heroParagraph")}
        headingTitle={
          <>
            {heroTitle[0]}
            <br /> <SuiteLandingHeroStrongLine line={projectHeroLine}>{heroTitle[1] || "apps"}</SuiteLandingHeroStrongLine>
          </>
        }
        listItems={projectHeroList}
        ctaLabel={t("suiteLanding.startBuilding")}
        rightSlot={<ProjectHeroPrompt suiteAppUrl={suiteAppUrl} marketingPath={projectMarketingPath} />}
      />
      <SuiteLandingFeatures
        suiteAppUrl={suiteAppUrl}
        marketingPath={projectMarketingPath}
        headingSubtitle={t("suiteLanding.project.featuresSubtitle")}
        headingParagraph={t("suiteLanding.project.featuresParagraph")}
        headingTitle={<>{featTitle[0]}<br />{featTitle[1]}</>}
        cards={projectFeatureCards}
      />
      <SuiteLandingHow
        accent={4}
        lineStroke={projectHowLine.strokeUrl}
        lineD={projectHowLine.d}
        lineViewBox={projectHowLine.viewBox}
        headingSubtitle={t("suiteLanding.howItWorks")}
        headingParagraph={t("suiteLanding.project.howParagraph")}
        headingTitle={<>{howTitle[0]}<br />{howTitle[1]}</>}
        steps={[
          { icon: "hugeicons:pencil-edit-02", number: 1, title: t("suiteLanding.project.step1Title"), description: t("suiteLanding.project.step1Desc") },
          { icon: "hugeicons:ai-generative", number: 2, title: t("suiteLanding.project.step2Title"), description: t("suiteLanding.project.step2Desc") },
          { icon: "hugeicons:laptop-cloud", number: 3, title: t("suiteLanding.project.step3Title"), description: t("suiteLanding.project.step3Desc") }
        ]}
        poweredTitle={t("suiteLanding.poweredByAI")}
      />
      <SuiteLandingPlans
        suiteAppUrl={suiteAppUrl}
        marketingPath={projectMarketingPath}
        headingSubtitle={t("suiteLanding.ourPricing")}
        headingParagraph={t("suiteLanding.pricingDesc")}
        headingTitle={<>{pricingTitle.map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</>}
        plans={projectPlans}
        sectionId="pricing"
      />
      <Portfolio
        subtitle="Kalit Portfolio"
        heading={<>Let your imagination run wild, <Underline stroke="url(#color-4-accent)">Kalit will create it</Underline></>}
        paragraph={<>Join over <Underline stroke="url(#color-4)">+10,000 developers</Underline> building the future on Kalit.</>}
        buttonText={t("suiteLanding.tryFree")}
        suiteAppUrl={suiteAppUrl}
        marketingPath={projectMarketingPath}
      />
    </>
  )
}
