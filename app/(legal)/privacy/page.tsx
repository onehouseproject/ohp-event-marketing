import type { Metadata } from "next";
import s from "./privacy.module.css";

// Set to the day the wording last changed. A literal string keeps the page static.
const LAST_UPDATED = "November 27, 2026";

const CONTACT = "canyon@onehouseproject.com";

export const metadata: Metadata = {
  title: "Privacy notice | One House Project",
  description:
    "What One House Project and its partners collect on events.onehouseproject.com, why, and how to opt out.",
};

export default function PrivacyPage() {
  return (
    <main className={s.page}>
      <div className={s.column}>
        <h1>Privacy notice</h1>
        <p className={s.updated}>Last updated {LAST_UPDATED}</p>
        <p>
          One House Project, Inc. is a 501(c)(3) public charity in Huntsville, Alabama. This
          notice covers events.onehouseproject.com, where we promote our events and sell tickets.
          It explains what we and our partners collect when you use these pages, why we collect
          it, and what you can do about it. If anything here is unclear, write to us at{" "}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>

        <h2>When you buy a ticket</h2>
        <p>
          Buying a ticket involves more than one company, so here is who does what. Ticket
          checkout opens inside our page, and{" "}
          <a href="https://givebutter.com/privacy">Givebutter</a> runs it under its own privacy
          policy. Givebutter&apos;s checkout loads Meta&apos;s and Google&apos;s tags itself,
          whatever our page does. Those companies handle that data under their own policies.
        </p>
        <p>
          Givebutter shares each order with us. That includes your name, email and phone number,
          what you bought, the amount, and the <code>utm_</code> campaign tags in the link you
          arrived from.
        </p>

        <h2>When you enter a giveaway</h2>
        <p>
          The giveaway form collects your first name, last name, mobile number and email. We store
          them in <a href="https://www.gohighlevel.com/privacy-policy">HighLevel</a>, our contact
          manager. We use them to run the drawing, contact the winner, and send news about this
          event and future One House Project events. Every email has an unsubscribe link, and you
          can use it at any time.
        </p>
        <p>
          About text messages: we send texts only to people who agree to them. Message frequency
          varies. Message and data rates may apply. Reply STOP to stop and HELP for help. We do not
          share your mobile number or your consent to receive texts with anyone else for their
          marketing.
        </p>

        <h2>When you visit</h2>
        <p>
          A few services run on our pages. Each one is listed here with what it collects and why
          we use it.
        </p>
        <h3>Meta Pixel</h3>
        <p>
          The Meta Pixel records page visits, clicks on ticket buttons, and checkout steps:
          adding a ticket, starting checkout, and a completed purchase and its amount. We use it to measure our Facebook and
          Instagram ads and to show ads to people who visited. Meta may connect this with other
          information it holds, under{" "}
          <a href="https://www.facebook.com/privacy/policy/">Meta&apos;s Privacy Policy</a>. We
          send Meta no form contents and no video viewing data. If your browser sends Global
          Privacy Control, our pages do not load the Meta Pixel. You can opt out of targeted
          advertising (see your choices below).
        </p>
        <h3>Vercel Analytics</h3>
        <p>
          Vercel Analytics counts visits and the pages viewed, without cookies. We use it to see
          which pages people read. See{" "}
          <a href="https://vercel.com/legal/privacy-notice">Vercel&apos;s privacy notice</a>.
        </p>
        <h3>Mux</h3>
        <p>
          Mux hosts and plays our video. It collects playback data (device, browser, video
          quality and how much was watched) to keep playback working. See{" "}
          <a href="https://www.mux.com/privacy">Mux&apos;s privacy policy</a>.
        </p>
        <h3>Google Maps</h3>
        <p>
          The venue map is a Google Maps embed. It loads when you scroll near it, and Google
          handles that data under{" "}
          <a href="https://policies.google.com/privacy">its own privacy policy</a>.
        </p>

        <h2>Your choices</h2>
        <p>
          You decide how much of this happens. Some choices are made in your browser, some with
          the companies named above, and some with us. Here is where to start.
        </p>
        <ul>
          <li>
            Turn on <a href="https://globalprivacycontrol.org/">Global Privacy Control</a> in your
            browser. It is a setting that tells websites you want to opt out of data sharing for
            advertising. When it is on, our pages do not load the Meta Pixel.
          </li>
          <li>
            Change how Meta uses your activity from other businesses in{" "}
            <a href="https://www.facebook.com/help/568137493302217">Meta&apos;s ad preferences</a>.
          </li>
          <li>
            Opt out of targeted advertising from many companies at the{" "}
            <a href="https://aboutads.info/choices">Digital Advertising Alliance opt-out page</a>.
          </li>
          <li>Block third-party cookies in your browser settings.</li>
          <li>Use the unsubscribe link in any email we send.</li>
          <li>Reply STOP to any text we send.</li>
        </ul>
        <p>
          To see, correct or delete your information, write to{" "}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. We reply within 45 days. If you disagree
          with a decision we made about your request, reply to our answer with &quot;appeal&quot;.
        </p>

        <h2>How long we keep it</h2>
        <p>
          This applies to what we hold in our own records, such as ticket orders and giveaway
          entries.
        </p>
        <p>
          We keep your information as long as we need it for our events and fundraising, or until
          you ask us to delete it.
        </p>

        <h2>Children</h2>
        <p>
          Our events are for people 21 and over. These pages are not meant for children under 13,
          and we do not knowingly collect their information. If you believe a child has given us
          information, write to <a href={`mailto:${CONTACT}`}>{CONTACT}</a> and we will look into
          it.
        </p>

        <h2>Changes</h2>
        <p>
          When this notice changes, we update the date at the top of the page, so check there for
          the latest version.
        </p>
      </div>
    </main>
  );
}
