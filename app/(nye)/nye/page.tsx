import { Cause } from "../_components/Cause";
import { Closing } from "../_components/Closing";
import { GiveawaySplash, SplashHeroNote } from "../_components/giveaway/GiveawaySplash";
import { GivebutterCheckout } from "../_components/givebutter";
import { Hero } from "../_components/Hero";
import { Questions } from "../_components/Questions";
import { RunOfShow } from "../_components/RunOfShow";
import { StickyBar } from "../_components/StickyBar";
import { TicketTable } from "../_components/TicketTable";
import { VenueSection } from "../_components/Venue";
import s from "./page.module.css";

export default function NyePage() {
  return (
    <main className={s.page}>
      <StickyBar />
      <Hero offerNote={<SplashHeroNote />} />
      <RunOfShow />
      <VenueSection />
      <TicketTable />
      <Cause />
      <Questions />
      <Closing />
      <GivebutterCheckout />
      <GiveawaySplash />
    </main>
  );
}
