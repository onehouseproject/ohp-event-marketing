// The six giveaway prototypes, in review order. The slug is the address: /nye/giveaway/<slug>.

export const OPTIONS = [
  {
    slug: "splash",
    title: "Splash on arrival",
    origin: "Chosen",
    summary:
      "A card greets every visitor before the page. They enter, or tap No thanks to reach the page. It fills a phone's screen.",
  },
  {
    slug: "inline",
    title: "A section of the page",
    origin: "Your brief",
    summary:
      "A giveaway section right under the hero, built like the page's own sections, with a line in the hero that points to it.",
  },
  {
    slug: "beside-package",
    title: "Beside Stay & Play",
    origin: "Your brief",
    summary:
      "A tear-off stub on the Stay & Play card and a bar under the ticket table. On a phone the stub opens the form in place.",
  },
  {
    slug: "hero",
    title: "Giveaway-first hero",
    origin: "New",
    summary:
      "The hero leads with the giveaway and its form, and booking becomes the second choice. Made for ads that promise the giveaway.",
  },
  {
    slug: "peek",
    title: "Peek-up after the hero",
    origin: "New",
    summary:
      "Nothing covers the first screen. Once the visitor scrolls past the hero, a card rises from the bottom. Closed, it waits as a tab on the edge.",
  },
  {
    slug: "marquee",
    title: "Marquee announcement",
    origin: "New",
    summary:
      "A bulb-lit marquee strip above the hero with the days left to the drawing. Its button opens the form.",
  },
] as const;

export type OptionSlug = (typeof OPTIONS)[number]["slug"];
