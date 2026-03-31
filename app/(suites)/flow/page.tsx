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
import { MetadataSeo } from "@/lib/metadata"
import { getSuiteById } from "@/lib/suites"
import {
  flowFeatureCards,
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

export default function FlowPage() {
  const flowSuite = getSuiteById("flow")
  const suiteAppUrl = flowSuite?.appUrl ?? ""

  return (
    <>
      <SuiteLandingHero
        suiteAppUrl={suiteAppUrl}
        marketingPath={flowMarketingPath}
        gradientColors={flowGradientColors}
        headingTag="h1"
        headingSubtitle="AI-powered project generation"
        headingParagraph="Powered by AI, Flow turns your ideas into fully working web projects in seconds."
        headingTitle={
          <>
            Build websites <br />
            <SuiteLandingHeroStrongLine line={flowHeroLine}>Instantly</SuiteLandingHeroStrongLine>
          </>
        }
        listItems={flowHeroList}
        ctaLabel="Get started"
        rightSlot={<FlowHeroPrompt suiteAppUrl={suiteAppUrl} marketingPath={flowMarketingPath} />}
      />
      <SuiteLandingFeatures
        suiteAppUrl={suiteAppUrl}
        marketingPath={flowMarketingPath}
        headingSubtitle="Our features"
        headingParagraph="From idea to deployed project in minutes. No barriers between your vision and a live website."
        headingTitle={
          <>
            Everything you need
            <br />
            to ship faster
          </>
        }
        cards={flowFeatureCards}
      />
      <SuiteLandingHow
        accent={2}
        lineStroke={flowHowLine.strokeUrl}
        lineD={flowHowLine.d}
        lineViewBox={flowHowLine.viewBox}
        headingSubtitle="How it works"
        headingParagraph="From idea to deployed project in minutes. No barriers between your vision and a live website."
        headingTitle={
          <>
            From concept to launch, <br />
            effortlessly
          </>
        }
        steps={[
          {
            icon: "hugeicons:pencil-edit-02",
            number: 1,
            title: "Write your prompt",
            description:
              "Describe the web project you want. Be as specific or general as you like — our AI adapts to your input."
          },
          {
            icon: "hugeicons:ai-generative",
            number: 2,
            title: "Watch it generate",
            description: "Our AI creates a complete, working web project based on your prompt."
          },
          {
            icon: "hugeicons:cloud-download",
            number: 3,
            title: "Preview & download",
            description: "Export as a ready-to-deploy package. Take full ownership of your code and host it anywhere."
          }
        ]}
        poweredTitle="Powered by leading AI models, orchestrated by Kalit"
      />
      <SuiteLandingPlans
        suiteAppUrl={suiteAppUrl}
        marketingPath={flowMarketingPath}
        headingSubtitle="Our pricing plans"
        headingParagraph="Start free, upgrade when you’re ready. No surprises. No hidden fees."
        headingTitle={
          <>
            Simple. Transparent.
            <br /> Built to scale.
          </>
        }
        plans={flowPlans}
      />
      <Portfolio
        subtitle="Sites built with Flow"
        heading={
          <>
            From idea to live pages, <br />
            without the grind
          </>
        }
        paragraph={
          <>
            Launch <Underline stroke="url(#color-2)">responsive sites</Underline> with AI layout, copy, and structure —
            ready to publish.
          </>
        }
        buttonText="Start building"
        suiteAppUrl={suiteAppUrl}
        marketingPath={flowMarketingPath}
      />
    </>
  )
}
