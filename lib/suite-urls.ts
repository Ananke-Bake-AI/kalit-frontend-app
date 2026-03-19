export const SUITE_URLS: Record<string, string> = {
  marketing: process.env.SUITE_MARKETING_URL || "http://localhost:3002",
  project: process.env.SUITE_PROJECT_URL || "http://localhost:3003",
  flow: process.env.SUITE_FLOW_URL || "http://localhost:3004",
  pentest: process.env.SUITE_PENTEST_URL || "http://localhost:3005",
}
