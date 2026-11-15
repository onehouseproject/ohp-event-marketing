import type { Metadata } from "next";
import { Comfortaa, Fuzzy_Bubbles, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@phosphor-icons/web/regular/style.css";
import "./_design/tokens.css";
import "./_design/components.css";
import { EVENT_NAME } from "./event";

// This Event Page has its own root layout, so its design system (Casino Night)
// never reaches another Event Page.

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const comfortaa = Comfortaa({ subsets: ["latin"], variable: "--font-comfortaa" });
const fuzzyBubbles = Fuzzy_Bubbles({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-fuzzy-bubbles",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://events.onehouseproject.com"),
  title: `${EVENT_NAME} | One House Project`,
  description:
    "Play. Dance. Count down. Stay the night. December 31 in Huntsville. Every chip builds a home.",
};

export default function NyeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${comfortaa.variable} ${fuzzyBubbles.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
