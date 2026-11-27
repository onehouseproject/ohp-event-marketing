import Script from "next/script";

// Issue 19, research memo: docs/research/2026-11-27-meta-pixel-and-highlevel-leads.md
// The Pixel ID comes from the environment and is set in Vercel Production only, so local
// and preview builds send nothing. Only digits reach the inline script.

export function MetaPixel() {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? "";
  if (!/^\d+$/.test(id)) return null;

  // disablePushState comes before init: fbevents.js otherwise fires a PageView on every
  // hash change (#tickets, #win). Global Privacy Control skips the Pixel entirely.
  const code = `if (navigator.globalPrivacyControl !== true) {
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq.disablePushState = true;
  fbq('init', '${id}');
  fbq('track', 'PageView');
}`;

  return (
    <>
      <Script id="meta-pixel">{code}</Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- Meta's tracking pixel must be a plain img inside noscript */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
