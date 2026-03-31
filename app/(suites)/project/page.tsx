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

export default function ProjectPage() {
  const projectSuite = getSuiteById("project")
  const suiteAppUrl = projectSuite?.appUrl ?? ""

  return (
    <>
      <SuiteLandingHero
        className={s.hero}
        suiteAppUrl={suiteAppUrl}
        marketingPath={projectMarketingPath}
        gradientColors={projectGradientColors}
        headingTag="h1"
        headingSubtitle="AI full-stack generation"
        headingParagraph="Generate complete applications with backend, infrastructure, and cloud hosting automatically."
        headingTitle={
          <>
            Ship full-stack
            <br /> <SuiteLandingHeroStrongLine line={projectHeroLine}>apps</SuiteLandingHeroStrongLine>
          </>
        }
        listItems={projectHeroList}
        ctaLabel="Start project"
        rightSlot={<ProjectHeroPrompt suiteAppUrl={suiteAppUrl} marketingPath={projectMarketingPath} />}
      />
      <SuiteLandingFeatures
        suiteAppUrl={suiteAppUrl}
        marketingPath={projectMarketingPath}
        headingSubtitle="Our features"
        headingParagraph="Generate complete applications with backend logic, infrastructure, and cloud deployment automatically."
        headingTitle={
          <>
            Everything you need to ship&nbsp;
            <br />
            &nbsp;real apps
          </>
        }
        cards={projectFeatureCards}
      />
      <SuiteLandingHow
        accent={4}
        lineStroke={projectHowLine.strokeUrl}
        lineD={projectHowLine.d}
        lineViewBox={projectHowLine.viewBox}
        headingSubtitle="How it works"
        headingParagraph="Describe your application and Kalit Project generates the frontend, backend, and infrastructure automatically."
        headingTitle={
          <>
            From idea to production
            <br />
            in minutes
          </>
        }
        steps={[
          {
            icon: "hugeicons:pencil-edit-02",
            number: 1,
            title: "Describe your project",
            description: "Define your product idea, features, or architecture and start generation instantly."
          },
          {
            icon: "hugeicons:ai-generative",
            number: 2,
            title: "Generate full stack",
            description: "Kalit Project builds frontend, backend logic, database structure, and APIs automatically."
          },
          {
            icon: "hugeicons:laptop-cloud",
            number: 3,
            title: "Deploy instantly",
            description: "Launch your application with integrated cloud hosting ready for real users."
          }
        ]}
        poweredTitle="Powered by next-generation full-stack AI"
      />
      <SuiteLandingPlans
        suiteAppUrl={suiteAppUrl}
        marketingPath={projectMarketingPath}
        headingSubtitle="Our pricing plans"
        headingParagraph="Start building full-stack applications for free. Upgrade when you're ready to scale infrastructure and hosting."
        headingTitle={
          <>
            Simple. Powerful.
            <br />
            Built for production.
          </>
        }
        plans={projectPlans}
        sectionId="pricing"
      />
      <Portfolio
        subtitle="Kalit Portfolio"
        heading={
          <>
            Let your imagination run wild, <Underline stroke="url(#color-4-accent)">Kalit will create it</Underline>
          </>
        }
        paragraph={
          <>
            Join over <Underline stroke="url(#color-4)">+10,000 developers</Underline> building the future on Kalit.
          </>
        }
        buttonText="Try it out for free"
        suiteAppUrl={suiteAppUrl}
        marketingPath={projectMarketingPath}
      />
    </>
  )
}
