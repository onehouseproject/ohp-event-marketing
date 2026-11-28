import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cause } from "../../../_components/Cause";
import { Closing } from "../../../_components/Closing";
import { GivebutterCheckout } from "../../../_components/givebutter";
import { Hero } from "../../../_components/Hero";
import { Questions } from "../../../_components/Questions";
import { RunOfShow } from "../../../_components/RunOfShow";
import { StickyBar } from "../../../_components/StickyBar";
import { TicketTable } from "../../../_components/TicketTable";
import { VenueSection } from "../../../_components/Venue";
import { SplashHeroNote } from "../../../_components/giveaway/Options";
import { ReviewBar } from "../../../_components/giveaway/ReviewBar";
import { SPLASHES } from "../../../_components/giveaway/splashCatalog";
import {
  SplashCountdown,
  SplashPriceTag,
  SplashStacked,
  SplashTicket,
  SplashTwoStep,
} from "../../../_components/giveaway/Splashes";
import s from "../../page.module.css";

// One splash variant over the Event Page as it is on /nye, with the hero's line to reopen it.

// The page reads its variant from the address before it renders anything, so a navigation into
// it may wait. That is fine for a review page, which the review strip loads in full anyway.
export const instant = false;

const VARIANTS = {
  stacked: SplashStacked,
  "two-step": SplashTwoStep,
  "price-tag": SplashPriceTag,
  countdown: SplashCountdown,
  ticket: SplashTicket,
} as const;

export function generateStaticParams() {
  return SPLASHES.map((item) => ({ variant: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/nye/splash/[variant]">): Promise<Metadata> {
  const { variant } = await params;
  const found = SPLASHES.find((item) => item.slug === variant);
  return {
    title: `Splash: ${found?.title ?? "prototype"} | One House Project`,
    robots: { index: false, follow: false },
  };
}

export default async function SplashPrototype({ params }: PageProps<"/nye/splash/[variant]">) {
  const { variant } = await params;
  if (!(variant in VARIANTS)) notFound();
  const Splash = VARIANTS[variant as keyof typeof VARIANTS];

  return (
    <main className={s.page}>
      <ReviewBar
        items={SPLASHES}
        slug={variant}
        base="/nye/splash"
        index={{ href: "/nye/splash", label: "All five" }}
      />
      <StickyBar />
      <Hero offerNote={<SplashHeroNote />} />
      <RunOfShow />
      <VenueSection />
      <TicketTable />
      <Cause />
      <Questions />
      <Closing />
      <GivebutterCheckout />
      <Splash />
    </main>
  );
}
