import type { PlanProps } from "@/components/plan"

type PublicPaidPlanOptions = {
  starterButtonText?: string
  proButtonText?: string
  enterpriseButtonText?: string
}

export function createPublicPaidPlans(
  options: PublicPaidPlanOptions = {}
): Omit<PlanProps, "action">[] {
  const {
    starterButtonText = "Get started",
    proButtonText = "Get started",
    enterpriseButtonText = "Get started",
  } = options

  return [
    {
      name: "Starter",
      tagline: "100 credits per month, 2 members.",
      price: "$29",
      priceSuffix: "per month",
      features: [
        "Kalit Flow access",
        "100 credits / month",
        "2 team members",
        "Custom domain",
        "Email support",
      ],
      buttonText: starterButtonText,
    },
    {
      name: "Pro",
      tagline: "500 credits per month, 10 members.",
      recommended: true,
      titleBadge: "Most selected",
      price: "$99",
      priceSuffix: "per month",
      features: [
        "Flow + Project + Marketing",
        "500 credits / month",
        "10 team members",
        "Deploy to production",
        "Priority support",
        "Custom domains",
      ],
      buttonText: proButtonText,
    },
    {
      name: "Enterprise",
      tagline: "2000 credits per month, unlimited members.",
      price: "$299",
      priceSuffix: "per month",
      features: [
        "All 4 suites",
        "2,000 credits / month",
        "Unlimited team members",
        "Priority execution",
        "Pentest scanning",
        "Dedicated support",
        "Custom integrations",
      ],
      buttonText: enterpriseButtonText,
    },
  ]
}
