import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found | One House Project",
};

// Shown for any address that matches no Event Page. It bypasses every layout,
// so it carries its own minimal styles and belongs to no event's design system.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <main>
          <h1 style={{ fontSize: 28, margin: "0 0 12px" }}>We could not find that page.</h1>
          <p style={{ margin: 0 }}>
            Visit <a href="https://onehouseproject.com">onehouseproject.com</a> to see what One
            House Project is up to.
          </p>
        </main>
      </body>
    </html>
  );
}
