import { Marquee } from "@/components/marquee"
import {
  MarketingHeroPrompt,
  SuiteLandingFeatures,
  SuiteLandingHero,
  SuiteLandingHow,
  SuiteLandingPlans
} from "@/components/suite-landing"
import { MetadataSeo } from "@/lib/metadata"
import { getSuiteById } from "@/lib/suites"
import {
  marketingEnterpriseMailHref,
  marketingFeatureCards,
  marketingGradientColors,
  marketingHeroList,
  marketingHowLine,
  marketingMarketingPath,
  marketingPlans
} from "./landing-data"
import s from "./marketing.module.scss"

export const viewport = {
  themeColor: "#6366F1"
}

export const metadata = MetadataSeo({
  fullTitle: "Kalit Marketing — Plan, create, run, and optimize acquisition campaigns",
  description:
    "Plan, create, run, and optimize acquisition campaigns across channels. AI handles the execution, you focus on the product.",
  favicon: "/favicon-marketing.svg",
  image: "/img/thumbnail-marketing.jpg"
})

const ADS = [
  {
    title: "Meta",
    image: "/img/ads/meta.png"
  },
  {
    title: "Facebook Ads",
    image: "/img/ads/facebook-ads.png"
  },
  {
    title: "Instagram Ads",
    image: "/img/ads/instagram-ads.png"
  },
  {
    title: "Google Ads",
    image: "/img/ads/google-ads.png"
  },
  {
    title: "Youtube",
    image: "/img/ads/youtube.png"
  },
  {
    title: "LinkedIn",
    image: "/img/ads/linkedin-ads.png"
  },
  {
    title: "X Ads",
    image: "/img/ads/x-ads.png"
  },
  {
    title: "TikTok Ads",
    image: "/img/ads/tiktok-ads.png"
  }
]

export default function MarketingPage() {
  const marketingSuite = getSuiteById("marketing")
  const suiteAppUrl = marketingSuite?.appUrl ?? ""

  return (
    <>
      <SuiteLandingHero
        suiteAppUrl={suiteAppUrl}
        marketingPath={marketingMarketingPath}
        gradientColors={marketingGradientColors}
        headingTag="h1"
        headingSubtitle="AI-powered campaign automation"
        headingParagraph="Connect your ad accounts, generate campaigns automatically, and optimize performance across platforms with AI."
        headingTitle={
          <>
            Automate your
            <br /> marketing with AI
          </>
        }
        listItems={marketingHeroList}
        ctaLabel="Start campaign"
        rightSlot={<MarketingHeroPrompt suiteAppUrl={suiteAppUrl} marketingPath={marketingMarketingPath} />}
      />
      <div className={s.marquee}>
        <Marquee className={s.marqueeScroll}>
          {ADS.map((ad) => (
            <img src={ad.image} alt={ad.title} width={335} height={105} draggable={false} loading="lazy" />
          ))}
        </Marquee>
      </div>
      <SuiteLandingFeatures
        suiteAppUrl={suiteAppUrl}
        marketingPath={marketingMarketingPath}
        headingSubtitle="Features"
        headingParagraph="Create campaigns, generate creatives, and optimize performance automatically across all your advertising platforms."
        headingTitle={
          <>
            Everything you need to scale
            <br />
            campaigns faster
          </>
        }
        cards={marketingFeatureCards}
      />
      <SuiteLandingHow
        accent={3}
        lineStroke={marketingHowLine.strokeUrl}
        lineD={marketingHowLine.d}
        lineViewBox={marketingHowLine.viewBox}
        headingSubtitle="How it works"
        headingParagraph="Connect your accounts, generate campaigns automatically, and let AI optimize performance continuously."
        headingTitle={
          <>
            Launch smarter campaigns
            <br />
            in minutes
          </>
        }
        steps={[
          {
            icon: "hugeicons:link-01",
            number: 1,
            title: "Connect your accounts",
            description: "Link Meta, Google, LinkedIn, and TikTok to start managing your campaigns instantly."
          },
          {
            icon: "hugeicons:ai-generative",
            number: 2,
            title: "Generate your campaign",
            description: "Kalit creates visuals, headlines, audience targeting, and campaign structure automatically."
          },
          {
            icon: "hugeicons:chart-breakout-circle",
            number: 3,
            title: "Optimize performance",
            description: "AI monitors results continuously and adapts campaigns to maximize conversions."
          }
        ]}
        poweredTitle="Powered by next-generation campaign optimization AI"
      />
      <SuiteLandingPlans
        suiteAppUrl={suiteAppUrl}
        marketingPath={marketingMarketingPath}
        headingSubtitle="Our pricing plans"
        headingParagraph="Start creating campaigns for free. Upgrade when you're ready to scale performance across platforms."
        headingTitle={
          <>
            Simple. Transparent.
            <br />
            Built to scale campaigns.
          </>
        }
        plans={marketingPlans}
        mailtoPlanNames={["Enterprise"]}
        mailtoHref={marketingEnterpriseMailHref}
      />
    </>
  )
}
