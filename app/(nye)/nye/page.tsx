import { GivebutterCheckout } from "../_components/givebutter";
import { Hero } from "../_components/Hero";
import {
  Cause,
  Closing,
  Giveaway,
  GoodToKnow,
  Intro,
  StayAndPlay,
  WhatsWaiting,
} from "../_components/Sections";
import { Tickets } from "../_components/Tickets";
import s from "./page.module.css";

export default function NyePage() {
  return (
    <main className={s.page}>
      <Hero />
      <Intro />
      <StayAndPlay />
      <WhatsWaiting />
      <Tickets />
      <Giveaway />
      <Cause />
      <GoodToKnow />
      <Closing />
      <GivebutterCheckout />
    </main>
  );
}
