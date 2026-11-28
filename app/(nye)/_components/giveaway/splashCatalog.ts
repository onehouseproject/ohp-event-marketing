// The five splash variants, in review order. The slug is the address: /nye/splash/<slug>.

export const SPLASHES = [
  {
    slug: "stacked",
    title: "Stacked, simplified",
    summary:
      "The earlier splash, tightened: a $399 headline, the three prize icons, the closing time as a chip over the form, and the opt-ins as two plain lines.",
  },
  {
    slug: "two-step",
    title: "Two steps",
    summary:
      "Email and name enter you. Then, already entered, an optional second step asks for a phone and the two opt-ins.",
  },
  {
    slug: "price-tag",
    title: "$399, free",
    summary:
      "The value leads: $399 struck through beside a big FREE, with the prizes as three tiles that say what the package is.",
  },
  {
    slug: "countdown",
    title: "Countdown first",
    summary:
      "A live countdown to noon Friday, between two bulb rows, opens the splash. The offer and the form follow.",
  },
  {
    slug: "ticket",
    title: "Admission ticket",
    summary:
      "The splash as a ticket for two: the offer above a tear line that carries the closing time, the form below it.",
  },
] as const;
