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
import { OPTIONS } from "../../../_components/giveaway/catalog";
import {
  HeroOffer,
  InlineHeroNote,
  InlineSection,
  Marquee,
  PackageStub,
  Peek,
  Splash,
  SplashHeroNote,
  TableBar,
} from "../../../_components/giveaway/Options";
import { ReviewBar } from "../../../_components/giveaway/ReviewBar";
import s from "../../page.module.css";

// One giveaway prototype: the Event Page as it is on /nye, with one option in place.

// The page reads its option from the address before it renders anything, so a navigation into
// it may wait. That is fine for a review page, which the review strip loads in full anyway.
export const instant = false;

export function generateStaticParams() {
  return OPTIONS.map((option) => ({ option: option.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/nye/giveaway/[option]">): Promise<Metadata> {
  const { option } = await params;
  const found = OPTIONS.find((item) => item.slug === option);
  return {
    title: `Giveaway: ${found?.title ?? "prototype"} | One House Project`,
    robots: { index: false, follow: false },
  };
}

export default async function GiveawayPrototype({ params }: PageProps<"/nye/giveaway/[option]">) {
  const { option } = await params;
  if (!OPTIONS.some((item) => item.slug === option)) notFound();

  const beside = option === "beside-package";

  return (
    <main className={s.page}>
      <ReviewBar slug={option} />
      {option === "marquee" ? <Marquee /> : null}
      <StickyBar />
      {option === "hero" ? (
        <Hero headline="Win New Year's Eve for two." ribbon={false} offer={<HeroOffer />} />
      ) : (
        <Hero
          offerNote={
            option === "inline" ? (
              <InlineHeroNote />
            ) : option === "splash" ? (
              <SplashHeroNote />
            ) : undefined
          }
        />
      )}
      {option === "inline" ? <InlineSection /> : null}
      <RunOfShow
        packageExtra={beside ? <PackageStub mode="inline" /> : undefined}
        railExtra={beside ? <PackageStub mode="dialog" /> : undefined}
      />
      <VenueSection />
      <TicketTable extra={beside ? <TableBar /> : undefined} />
      <Cause />
      <Questions />
      <Closing />
      <GivebutterCheckout />
      {option === "splash" ? <Splash /> : null}
      {option === "peek" ? <Peek /> : null}
    </main>
  );
}
