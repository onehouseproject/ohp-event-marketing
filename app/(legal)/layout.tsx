import type { Metadata } from "next";

// Pages in this group speak for One House Project rather than one Event, so they
// get their own root layout. It loads no design system and imports nothing from
// an Event Page's group, because Event Pages share nothing.

export const metadata: Metadata = {
  metadataBase: new URL("https://events.onehouseproject.com"),
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    // The page's own styles cover only <main>, so the document itself follows the
    // visitor's light or dark setting and drops the browser's default body margin.
    <html lang="en" style={{ colorScheme: "light dark" }}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
