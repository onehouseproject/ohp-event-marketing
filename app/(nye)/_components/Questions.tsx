import s from "./Questions.module.css";
import u from "./shared.module.css";

// The questions a buyer has at the button. The first three start open.
const QUESTIONS = [
  [
    "Is it an open bar? Is dinner included?",
    "It isn't an open bar. Every VIP ticket comes with 2 drink tickets, so Stay & Play for Two gives the two of you 4. After that, and for general admission, drinks are pay as you go, and the bar takes cards. VIP and Stay & Play guests get unlimited food. General admission guests can buy food at the party.",
  ],
  [
    "Is $399 the whole price?",
    'Yes. $399 covers both of you: two VIP tickets and a hotel room upstairs, room tax included. A secure Givebutter checkout opens on this page. Tap + beside "Stay & Play for Two" once, pay, and your tickets arrive by email.',
  ],
  [
    "How does the room work?",
    "We book it at the Hilton Garden Inn Huntsville South for the night of Thursday, December 31. Check in, get ready at the hotel and take the elevator down. Head back up whenever you're done. Check-in is from 3 PM and checkout is 11 AM, with breakfast for two included that morning.",
  ],
  [
    "Do we play for real money? What if I've never played?",
    "No. Nobody plays for money. Every game uses play chips with no cash value. Our gaming partner, Huntsville Casino Parties, runs the tables, and their dealers teach every game as you go.",
  ],
  [
    "What can I win?",
    "A $6,000 kitchen design package from Compass Design Studio: its Design Essentials process, which ends with schematic plans ready for a builder to price. Prizes are never cash.",
  ],
  [
    "What about the kids?",
    "This one's just for the two of you. The night is 21 and over, and childcare isn't included. Ask the grandparents now: it's one night, and New Year's Eve sitters go fast.",
  ],
  [
    "Can friends come? Do we have to be a couple?",
    "Bring them. Stay & Play for Two is for any two adults: your partner, your best friend or your favorite plus-one.",
  ],
  [
    "What should I wear?",
    "Whatever makes you feel like a high roller. Glam is encouraged but not required.",
  ],
  [
    "Can I support without attending?",
    'Yes. Tap any ticket button and choose "I\'d just like to donate" at the bottom of the checkout.',
  ],
] as const;

const OPEN_AT_FIRST = 3;

/** Common questions, as rows that open. */
export function Questions() {
  return (
    <section className={u.section}>
      <div className={u.inner}>
        <h2 className={`display-m ${u.h2}`}>Good to know</h2>
        <div className={s.faq}>
          {QUESTIONS.map(([question, answer], index) => (
            <details key={question} className={s.faqRow} open={index < OPEN_AT_FIRST}>
              <summary>
                <span>{question}</span>
                <i className="ph ph-caret-down" aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
