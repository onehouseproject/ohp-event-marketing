import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // This repository maintains its own AGENTS.md, so Next.js must not rewrite it.
  agentRules: false,
  experimental: {
    // Each Event Page has its own root layout, so the 404 page lives in app/global-not-found.tsx.
    globalNotFound: true,
  },
  async redirects() {
    return [
      // Only one Event Page exists. See docs/open-items.md, item 2.
      { source: "/", destination: "/nye", permanent: false },
    ];
  },
};

export default withBotId(nextConfig);
