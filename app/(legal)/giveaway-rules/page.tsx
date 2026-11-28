import type { Metadata } from "next";
import s from "../legal.module.css";

// Set to the day the wording last changed. A literal string keeps the page static.
const LAST_UPDATED = "November 27, 2026";

/** Pending counsel (#18): shown until counsel's official rules replace the draft below. */
const DRAFT_BANNER =
  "Draft: placeholder text pending counsel review. These are not yet the official rules.";

const CONTACT = "canyon@onehouseproject.com";

export const metadata: Metadata = {
  title: "Stay & Play for Two Giveaway Official Rules | One House Project",
  description: "The official rules for One House Project's Stay & Play for Two giveaway.",
};

// Every section below is the draft rules from
// docs/research/2026-11-27-nye-giveaway-rules-and-prize-mechanics.md, bracketed notes included.
// Counsel's final text replaces them, and the banner comes off when it does.
export default function GiveawayRulesPage() {
  return (
    <main className={s.page}>
      <div className={s.column}>
        <p className={s.banner} role="note">
          {DRAFT_BANNER}
        </p>
        <h1>Stay &amp; Play for Two Giveaway Official Rules</h1>
        <p className={s.updated}>Last updated {LAST_UPDATED}</p>

        <h2>Sponsor and eligibility</h2>
        <p>
          One House Project, Inc., 1778 New Market Rd, New Market, AL 35761. Open to Alabama
          residents age 21 or older at entry. People involved in administering the drawing and
          members of their immediate families or households are ineligible. Void where
          prohibited. <a href="https://www.onehouseproject.com/">Sponsor address</a>
        </p>

        <h2>How to enter</h2>
        <p>
          Submit your name and email at the <a href="/nye#giveaway">free entry form</a>. Entries
          are scheduled to open at <strong>9:00 a.m. Central Time on Monday, November 30, 2026</strong>{" "}
          [confirm actual time before publishing]. Entries must be received before{" "}
          <strong>12:00 p.m. Central Time on Friday, December 4, 2026</strong>. Limit one entry
          per person. Buying, donating, attending or subscribing has no effect on entry or odds.
          Prior ticket buyers enter through the same form.
        </p>

        <h2>Drawing and claim</h2>
        <p>
          At <strong>2:00 p.m. Central Time on Friday, December 4, 2026</strong>, OHP will
          randomly select one potential winner from all eligible entries. Odds depend on the
          number of eligible entries received. OHP will notify the potential winner by email that
          afternoon. They have 72 hours from notice to respond and verify eligibility. If they
          decline, miss the deadline or are ineligible, OHP will randomly select an alternate.
          You need not be present to win.
        </p>

        <h2>Prize</h2>
        <p>
          One Stay &amp; Play for Two package for December 31, 2026, including two VIP
          admissions, one night at Hilton Garden Inn Huntsville South/Redstone Arsenal, room tax
          and breakfast for two. Approximate retail value $399 [verify against the public
          package price before publishing]. The winner and guest must be 21 or older and show
          valid ID. Travel and incidental expenses are the winner&apos;s responsibility. If the
          confirmed winner purchased a Stay &amp; Play for Two package before OHP sent their
          selection email, OHP will reimburse the amount actually paid for one package,
          including any required fees attributable to it. Optional tips, voluntary donations and
          other purchases are excluded. The winner keeps their existing package, including both
          VIP admissions and the hotel reservation, and receives no second package. For other
          winners, the prize is the package with no cash substitute. If the event is
          rescheduled, OHP will offer the package on the new date. If the event is canceled or
          the winner cannot attend the new date, OHP will offer a comparable noncash prize of
          equal or greater value. For a winner who already booked, any event refund for the
          package will count toward the reimbursement described above.{" "}
          <a href="https://events.onehouseproject.com/nye">Advertised package</a>
        </p>

        <h2>Platform release and contact</h2>
        <p>
          By entering, each participant releases and holds harmless Meta, including Facebook and
          Instagram, from liability arising from the giveaway to the extent permitted by law. The
          giveaway is sponsored and administered by One House Project, Inc. and is in no way
          sponsored, endorsed, administered by or associated with Facebook or Instagram.
          Questions may be sent to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>
      </div>
    </main>
  );
}
