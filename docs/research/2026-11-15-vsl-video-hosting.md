# Where to host the VSL video for Event Pages

Research memo for issue 2, written 2026-11-15. Every source below was read on 2026-11-15 unless a line says otherwise.

## Short answer

**Recommendation: Mux.** It plays the video in short pieces at the quality a phone connection can hold (adaptive bitrate, explained below), shows no host logo or suggested videos in the docs, and costs nothing for the first 100,000 minutes delivered each month ([mux-pricing]). For the working case (a 5 minute video), that covers 20,000 plays watched to the end, or 50,000 plays if the average visitor watches 40 percent. Above that it costs about $0.0008 per minute delivered. The price of 50,000 full plays of a 5 minute video is about $100 a month. Mux also offers one-time credits to nonprofits ([mux-pricing]).

**Runner-up: Wistia, Business plan.** It is the marketing-minded choice: a player with muted autoplay support, a ready-made viewing dashboard with heatmaps and per-viewer data, and a React component. It costs $79 a month billed annually ([wistia-pricing], read 2026-11-15), which is about $948 a year, and Wistia offers a nonprofit discount of an unstated size ([wistia-billing]).

Three facts that change the picture:

1. **Vimeo is the expensive trap.** Vimeo's own policy says an account used by a nonprofit has to be on a business plan ([vimeo-policy]). The only self-serve business plan is Studio, at $400 a month billed annually, or $4,800 a year ([vimeo-studio]). Vimeo's cheap individual plans ($0 to $71 a month, [vimeo-2026]) are meant for single people.
2. **YouTube cannot be made clean.** The `rel=0` setting no longer turns off suggested videos. It only limits them to the same channel ([yt-params]). The `modestbranding` setting, which hid the logo, now does nothing ([yt-params]), and YouTube's policy forbids removing or hiding links in its player ([yt-devpol]). A visitor can always click out of the page.
3. **A plain MP4 is the worst choice for a weak phone signal, and the size you upload is the size visitors download.** A 5 minute 1080p file at about 6.5 Mbps is about 244 MB. It has one quality and no adjusting. On Vercel Blob the list rate is $0.05 per GB delivered ([vercel-iad1], read 2026-11-15).

The owner's own file decides little for most hosts. Mux, Cloudflare Stream, Bunny, Vimeo, Wistia and YouTube all re-encode what you upload, so upload the largest, best file. Only the plain MP4 options serve your file as it is. See "Which file size to upload".

## Cost per month

### The assumptions behind the numbers

The video's running time was given as 4:35:19, read as 4 minutes 35 seconds, not yet confirmed. The working length here is 5 minutes. The 3 and 10 minute cases the issue asked for are shown too. Size and resolution are not recorded, so every cost uses stated bitrates instead of a file size.

| Assumption | Value | Why |
| --- | --- | --- |
| A play | One visitor starting the video once in the month (autoplay counts) | Hosts that bill on minutes delivered count what is sent, not what is watched |
| Length | 3, 5 and 10 minutes, all stored as one video | The issue asked for 3 and 10; the owner's time points to 5 |
| Average watch | 100 percent (everyone watches to the end) and 40 percent | The 40 percent is my assumption. No primary source gives a watch fraction for a sales video. Read the 40 percent column as a realistic partial case, and the 100 percent column as the ceiling |
| Minutes delivered | plays x length x watch fraction | Billing also counts video that was preloaded and never watched ([mux-estimate] says so for Mux, [cf-pricing] for Cloudflare), so real bills run slightly higher. By how much is unconfirmed |
| Bitrate of the file as uploaded | 6.5 Mbps (mid point of 5 to 8 Mbps for 1080p) | Cloudflare recommends 8 Mbps for 1080p ([cf-faq]). Mux's own calculator uses 5.33 Mbps for 1080p ([mux-estimate]) |
| Bitrate delivered by an adaptive host to a phone | 3.33 Mbps (Mux's default for 720p, [mux-estimate]) | A phone gets a lower rung than the full 1080p. This is an assumption |
| Gigabytes per minute | Mbps / 8 x 60 / 1000 | 6.5 Mbps is 0.04875 GB a minute. 3.33 Mbps is 0.02498 GB a minute |

File size at 6.5 Mbps for the original 1080p MP4: 3 minutes is 146 MB, 5 minutes is 244 MB, 10 minutes is 488 MB.

Minutes stored: 3, 5 or 10 minutes per video. Each future Event Page adds its own video's minutes.

Worked example, 5 minute video:

| Plays | Watching | Minutes delivered | GB, adaptive host at 3.33 Mbps | GB, plain MP4 at 6.5 Mbps |
| --- | --- | --- | --- | --- |
| 1,000 | all of it | 5,000 | 125 | 244 |
| 10,000 | all of it | 50,000 | 1,249 | 2,438 |
| 50,000 | all of it | 250,000 | 6,244 | 12,188 |
| 1,000 | 40 percent | 2,000 | 50 | 98 |
| 10,000 | 40 percent | 20,000 | 500 | 975 |
| 50,000 | 40 percent | 100,000 | 2,498 | 4,875 |

Rates used. Each price was read on 2026-11-15 at the page linked in its row.

| Option | Rate used | Source (all read 2026-11-15) |
| --- | --- | --- |
| YouTube | $0. No price page exists for unlisted embeds | Task statement. See [yt-ads-embed] for the ads rule |
| Vimeo | Free $0 (1 TB a month managed bandwidth), Creator $9 a month billed annually or $16 monthly, Core $24.50 or $40 (2 TB), Professional $71 or $120 (2 TB), Studio $400 a month billed annually (36 TB a year) | [vimeo-2026] |
| Wistia | Free $0 (25 GB storage, 200 GB bandwidth, hard stop), Business $79 a month billed annually (250 GB storage, 1 TB bandwidth), extra bandwidth bought in advance: +1 TB $150, +2 TB $280, +3 TB $390 a month. The monthly (not annual) Business price was not read: unconfirmed | [wistia-pricing], [wistia-usage] |
| Wistia Developer plan | $0 below 25 GB storage and 200 GB bandwidth, then $25 a month plus $0.08 per GB from 200 to 1,000 GB, $0.06 from 1,000 to 2,500 GB, $0.05 from 2,500 to 5,000 GB | [wistia-dev] |
| Mux | First 100,000 minutes delivered each month free. Pay as you go adds a $20 monthly credit. Delivery $0.0008 per minute up to 720p, $0.001 at 1080p (first 500,000 minute tier). Storage $0.003 per minute a month at 1080p. Basic quality input free. Plus quality input $0.03125 per minute at 1080p | [mux-pricing] |
| Cloudflare Stream | $5 per month per 1,000 minutes of storage capacity. $1 per 1,000 minutes delivered. No free tier appears on the page | [cf-pricing] |
| Bunny Stream | Delivery $0.01 per GB in Europe and North America ($0.03 Asia and Oceania, $0.045 South America, $0.06 Middle East and Africa). Storage $0.01 per GB. Encoding free. $1 minimum a month | [bunny-pricing-doc], [bunny-cdn] |
| MP4 on Vercel Blob | Blob data transfer $0.05 per GB, storage $0.023 per GB (Washington D.C. region, Pro). Pro plan $20 a month plus $20 usage credit | [vercel-iad1], [vercel-pro] |
| MP4 on Cloudflare R2 | Storage $0.015 per GB a month, 10 GB free, egress (data out to visitors) free | [cf-r2-pricing] |

### 5 minute video (working case)

Full = everyone watches to the end. 40% = the average visitor watches 40 percent. The columns show plays in the month.

| Option | Full, 1,000 | Full, 10,000 | Full, 50,000 | 40%, 1,000 | 40%, 10,000 | 40%, 50,000 |
| --- | --- | --- | --- | --- | --- | --- |
| YouTube (unlisted) | $0 | $0 | $0 | $0 | $0 | $0 |
| Vimeo, individual plan (only if Vimeo lets a nonprofit use one) | $9 (Creator) | $24.50 (Core) | over the 2 TB cap | $9 (Creator) | $9 (Creator) | over the 2 TB cap |
| Vimeo Studio (the plan Vimeo's policy points a nonprofit to) | $400 | $400 | $400 | $400 | $400 | $400 |
| Wistia, Free or Business, whichever fits | $0 (Free) | $229 (Business + 1 TB add-on) | over 4 TB, ask sales | $0 (Free) | $79 (Business) | $359 (Business + 2 TB add-on) |
| Wistia Developer plan | $0 | $104 | over 5 TB, custom | $0 | $49 | $179 |
| Mux, pay as you go | $0 | $0 | $100 | $0 | $0 | $0 |
| Cloudflare Stream | $10 | $55 | $255 | $7 | $25 | $105 |
| Bunny Stream | $1.25 | $12.49 | $62.44 | $1 | $5 | $24.98 |
| MP4 on Vercel Blob (list rate) | $12.19 | $121.88 | $609.38 | $4.88 | $48.75 | $243.75 |
| MP4 on Cloudflare R2 | $0 | $0 | $0 | $0 | $0 | $0 |

### 3 minute video

| Option | Full, 1,000 | Full, 10,000 | Full, 50,000 | 40%, 1,000 | 40%, 10,000 | 40%, 50,000 |
| --- | --- | --- | --- | --- | --- | --- |
| YouTube (unlisted) | $0 | $0 | $0 | $0 | $0 | $0 |
| Vimeo, individual plan | $9 (Creator) | $9 (Creator) | over the 2 TB cap | $9 (Creator) | $9 (Creator) | $24.50 (Core) |
| Vimeo Studio | $400 | $400 | $400 | $400 | $400 | $400 |
| Wistia, Free or Business, whichever fits | $0 (Free) | $79 (Business) | $469 (Business + 3 TB add-on) | $0 (Free) | $79 (Business) | $229 (Business + 1 TB add-on) |
| Wistia Developer plan | $0 | $69 | $241 | $0 | $33 | $119 |
| Mux, pay as you go | $0 | $0 | $20 | $0 | $0 | $0 |
| Cloudflare Stream | $8 | $35 | $155 | $6.20 | $17 | $65 |
| Bunny Stream | $1 | $7.49 | $37.46 | $1 | $3 | $14.98 |
| MP4 on Vercel Blob (list rate) | $7.31 | $73.12 | $365.62 | $2.93 | $29.25 | $146.25 |
| MP4 on Cloudflare R2 | $0 | $0 | $0 | $0 | $0 | $0 |

### 10 minute video

| Option | Full, 1,000 | Full, 10,000 | Full, 50,000 | 40%, 1,000 | 40%, 10,000 | 40%, 50,000 |
| --- | --- | --- | --- | --- | --- | --- |
| YouTube (unlisted) | $0 | $0 | $0 | $0 | $0 | $0 |
| Vimeo, individual plan | $9 (Creator) | over the 2 TB cap | over the 2 TB cap | $9 (Creator) | $9 (Creator) | over the 2 TB cap |
| Vimeo Studio | $400 | $400 | $400 | $400 | $400 | $400 |
| Wistia, Free or Business, whichever fits | $79 (Business) | $359 (Business + 2 TB add-on) | over 4 TB, ask sales | $0 (Free) | $79 (Business) | over 4 TB, ask sales |
| Wistia Developer plan | $29 | $179 | over 5 TB, custom | $0 | $89 | $304 |
| Mux, pay as you go | $0 | $0 | $300 | $0 | $0 | $60 |
| Cloudflare Stream | $15 | $105 | $505 | $9 | $45 | $205 |
| Bunny Stream | $2.50 | $24.98 | $124.88 | $1 | $9.99 | $49.95 |
| MP4 on Vercel Blob (list rate) | $24.38 | $243.75 | $1,218.75 | $9.75 | $97.50 | $487.50 |
| MP4 on Cloudflare R2 | $0 | $0 | $0 | $0 | $0 | $0 |

How to read the tables, and what each line leaves out:

- **Mux:** minutes delivered minus 100,000 free, times $0.0008 (the 720p rate; at the 1080p rate of $0.001 the paid cases cost 25 percent more), minus the $20 pay-as-you-go credit, never below zero. Storage adds about $0.015 a month for 5 minutes at 1080p. One-time plus-quality input adds about $0.16 for 5 minutes at 1080p. Basic quality has free input but a lower target video quality ([mux-pricing]). The Free plan has the same 100,000 free minutes but a 10 video storage limit ([mux-plan-page]); what happens past 100,000 minutes on the Free plan is unconfirmed, so the paid cases assume pay as you go.
- **Cloudflare Stream:** $5 (the smallest storage block, 1,000 minutes) plus $1 per 1,000 minutes delivered. Delivery rounds to 4 second pieces ([cf-pricing]).
- **Bunny Stream:** GB at 3.33 Mbps times $0.01, never below the $1 monthly minimum. Storage of the encoded copies adds a few cents. All numbers assume a visitor in Europe or North America. A visitor elsewhere costs 3 to 6 times more per GB ([bunny-cdn]).
- **Vimeo, individual plan:** the smallest individual plan whose managed bandwidth cap covers the GB (Creator 1 TB a month, Core 2 TB a month). Vimeo's embeddable videos count as managed ([vimeo-managed]). Creator is the cheapest plan that allows hiding the controls ([vimeo-params]). Studio is capped at 36 TB a year ([vimeo-2026]), so a short campaign fits.
- **Wistia, Free or Business:** Free if 200 GB or less (it stops playing when the limit is hit, and keeps the Wistia logo), otherwise Business at $79 plus bandwidth added in advance. The overage rate per GB on Business was not found: unconfirmed. Wistia delivers a smaller "smart encoded" version at typical embed sizes ([wistia-usage]), so Wistia's real GB may be lower than the 3.33 Mbps assumption.
- **MP4 on Vercel Blob:** GB at 6.5 Mbps times $0.05. Pro may cover the first 1 TB of data transfer through its flat-rate CDN tier, which could lower the bill by up to $50 ([vercel-blob-pricing]; unconfirmed whether Blob Data Transfer is covered by it). Add $20 a month for the Pro plan if the site is not on Pro already. Hobby is limited to personal or non-commercial use ([vercel-terms]). Browsers fetch plain MP4 files in ranges and may download more than a visitor watches (inferred).
- **MP4 on R2:** one GB-sized file stays under the free 10 GB storage, and the request counts stay under the free tier (inferred: 50,000 plays at 10 requests each is 500,000, below 10 million free Class B requests, [cf-r2-pricing]). Egress is free. A custom domain is needed for a production address, since the `r2.dev` address is for non-production use ([cf-r2-public]); whether the domain must use Cloudflare DNS is unconfirmed.

## Sources and how they are cited

Every citation is a link label in square brackets. The full address of each label is listed at the end of this memo. Read dates are 2026-11-15 for all of them.

- **Docs** means the vendor's own help center, developer docs or API reference. Examples: YouTube's player parameters page ([yt-params]), Vimeo's help center ([vimeo-params]), Wistia's developer docs ([wistia-attrs]), Mux's `llms.txt` and Markdown docs ([mux-vjs]), Cloudflare's docs read as Markdown ([cf-player]), Bunny's docs read as Markdown ([bunny-embed]), Vercel's docs read as Markdown ([vercel-blob-pricing]).
- **Pricing pages** are cited next to each price, with the date in the sentence or table.
- **Terms and policy** pages: Vimeo's Plan Usage Policy ([vimeo-policy]), Vercel's Terms of Service ([vercel-terms]), Cloudflare's service terms ([cf-terms]), and the YouTube developer policies ([yt-devpol]).
- **Browser behaviour** comes from MDN ([mdn-autoplay], [mdn-video]) and WebKit's own blog ([webkit-video]).
- **Law:** the Video Privacy Protection Act text at [vppa].
- **Measured by me:** the size on the wire of some public player scripts, fetched with `curl` on 2026-11-15, no account used. These are marked "measured". They cover the script, not the player inside an iframe.
- A few help pages were seen only through a search summary and not opened. These are marked "(search summary)". They are: YouTube audience retention ([yt-ret]), YouTube download ([yt-dl]), Vimeo downloads ([vimeo-dl]), Vimeo adaptive streaming ([vimeo-adaptive]), Vimeo analytics terms ([vimeo-analytics]), Wistia branding ([wistia-branding]), Wistia exports ([wistia-export]) and Wistia media delivery ([wistia-delivery]).
- "Inferred" marks my own reasoning from the sources. "Unconfirmed" marks something I could not establish from a primary source. The last section collects them.

No account was created, nothing was uploaded and no payment details were entered. No review sites or comparison blogs were used as evidence. Search results were used only to find the vendor's own pages.

## Comparison tables

The eight options are the same rows in all three tables. Words in a cell are explained in the option sections below. **Adaptive bitrate** means the host makes several quality levels of the video, and the player switches between them as the connection changes, so a weak signal gets a lower quality instead of a stalled picture. **HLS** and **DASH** are the two common ways of doing that. **Egress** means data sent out to visitors.

### Points 1 to 3: cost, weak phone signal, page load

| Option | 1. Cost (see the cost tables) | 2. Weak phone signal | 3. Effect on page load before play |
| --- | --- | --- | --- |
| YouTube (unlisted) | $0 at every volume. Embedded videos honor the channel's ad settings, so no ads unless the channel is monetized ([yt-ads-embed]) | Adaptive: Auto quality adjusts to viewing conditions ([yt-quality]) | Standard iframe weight: unconfirmed. Facade (poster first, player on tap) exists: Next.js `YouTubeEmbed` uses lite-youtube-embed ([next-3p]), whose script I measured at 3.8 KB |
| Vimeo | Free $0 up to 1 TB a month, but the policy says a nonprofit must use a business plan: Studio $400 a month billed annually ([vimeo-policy], [vimeo-studio]) | Adaptive: Auto quality picks by connection, 240p needs about 500 kbps ([vimeo-adaptive], search summary) | Iframe weight: unconfirmed. Player SDK script measured at 7.9 KB. No facade provided |
| Wistia | Free $0 (200 GB, then stops), Business $79 a month billed annually (1 TB), nonprofit discount on request ([wistia-pricing], [wistia-billing]) | Adaptive: quality follows connection, about 768 kbps is the minimum, 5 Mbps recommended for HD ([wistia-viewing]) | Player script measured at 57 KB. A thumbnail that plays on its own uses bandwidth before anyone presses play ([wistia-usage]) |
| Mux | $0 up to 100,000 minutes delivered a month, then about $0.0008 a minute ([mux-pricing]) | Adaptive HLS ([mux-pricing]). The basic quality level has a reduced set of quality levels ([mux-pricing]) | Video.js core measured at 15 KB and the Mux Data add-on at 28 KB. The poster is a plain image from `image.mux.com` ([mux-images]), so poster-only load is possible. Real player weight: unconfirmed |
| Cloudflare Stream | $5 plus $1 per 1,000 minutes delivered, no free tier on the page ([cf-pricing]) | Adaptive HLS and DASH ([cf-own-player]) | Player SDK measured at 6.3 KB, iframe weight unconfirmed. Cloudflare says PageSpeed penalizes each player and suggests lazy loading players that start below the first screen ([cf-faq]) |
| Bunny Stream | $1 minimum, about $0.01 per GB in Europe and North America ([bunny-pricing-doc]) | Adaptive HLS with a quality menu. `levelCap` stops a small player from downloading high resolutions ([bunny-player], [bunny-embed]) | Player.js measured at 4.1 KB, iframe weight unconfirmed. `preload` defaults to true and `autoplay` defaults to true, so set both on purpose ([bunny-embed]) |
| MP4 on Vercel Blob or in the repository | List rate $0.05 per GB, so a 5 minute video at 50,000 full plays is about $609 ([vercel-iad1]). A file in the repository must stay under GitHub's 100 MiB block ([github-large]) and Vercel's 100 MB (Hobby) or 1 GB (Pro) upload limit ([vercel-limits]) | One quality only. Inferred: at 6.5 Mbps, a visitor on 2 Mbps gets about a third of the speed needed, so the picture stalls | No script. `<video preload="none" poster>` fetches only the poster until play ([mdn-video]) |
| MP4 on Cloudflare R2 (extra candidate) | $0 at these volumes, egress is free ([cf-r2-pricing]) | One quality only, the same as the other plain MP4 | No script. The same `<video>` tag |

### Points 4 to 6: what the visitor sees, player control, statistics

| Option | 4. What the visitor sees besides the video | 5. Player control: muted autoplay, poster, hiding controls, captions | 6. Statistics, and the plan they need |
| --- | --- | --- | --- |
| YouTube (unlisted) | YouTube branding and links stay; policy forbids removing links ([yt-devpol]). `modestbranding` does nothing now. `rel=0` limits related videos to the same channel and cannot turn them off ([yt-params]). YouTube's release notes call titles, channel information and related videos core to the player ([yt-params]) | `autoplay=1` and `playsinline=1` are documented. Muting is by the API method `mute()` ([yt-api]); a `mute` URL parameter is not on the parameters page. `controls=0` hides controls, `fs=0` hides fullscreen, `cc_load_policy=1` shows captions ([yt-params]). Poster is the video's own thumbnail. Custom thumbnail steps: unconfirmed | Studio shows audience retention and average percentage viewed ([yt-ret], search summary). Autoplayed embeds do not count as views ([yt-embed-help]). How embedded views appear in reports: unconfirmed. No per-viewer data |
| Vimeo | On Free the Vimeo logo shows (hiding it needs a paid plan, [vimeo-embed-plan]). After the video, "More videos" and other end screens need Professional or higher ([vimeo-endscreen]). Free is ad-free ([vimeo-compare]) | `autoplay=1&muted=1` is documented, and `playsinline` defaults to true ([vimeo-params]). `controls=0` and player colors need a paid plan ([vimeo-params]). Custom poster: unconfirmed. Captions: uploads and auto-captions on all plans ([vimeo-compare]) | Engagement analytics on all plans; event analytics on Professional and up ([vimeo-compare]). Plays, finishes and average percentage watched exist ([vimeo-analytics], search summary). Per-viewer data comes through registration forms on Professional and up ([vimeo-compare], [vimeo-endscreen]). `dnt=1` blocks analytics ([vimeo-params]) |
| Wistia | Free keeps a Wistia logo that cannot be turned off; Business removes it ([wistia-pricing], [wistia-branding], search summary). Ad-free player on all plans ([wistia-pricing]) | `autoplay` plus `silent-autoplay` is documented for iOS and Chrome rules ([wistia-attrs]). `poster` takes any image URL ([wistia-attrs]). Each control can be turned off, including the play bar and `controls-visible-on-load` ([wistia-attrs]). Captions are supported and have a change event ([wistia-events]); the upload steps were not read: unconfirmed | Free: basic analytics. Business: heatmaps and engagement graphs ([wistia-pricing]). Per-viewer data: the `email` attribute ties a session to an address ([wistia-attrs]). Privacy Mode makes viewers anonymous ([wistia-privacy-docs]) |
| Mux | No host logo or suggested videos appear in the docs read. You build the player UI with Video.js ([mux-vjs]). Not seen running: unconfirmed | `muted autoplay playsinline` are standard `<video>` attributes (inferred, the Mux quick start shows `playsinline` [mux-vjs]). Poster from `image.mux.com` with a chosen `time`, or any image ([mux-images]). Controls are your skin (inferred). Captions are stored with the video at no extra storage charge ([mux-pricing]) | Mux Data (views, watch time, quality) is included at no extra charge while videos are on Mux ([mux-pricing]). `viewer_user_id` can be set per viewer ([mux-vjs]). Whether Data shows percent watched, and on the Free plan: unconfirmed |
| Cloudflare Stream | The docs describe no host logo and no suggested videos. Your own logo can be added ([cf-enhance]). Not seen running: unconfirmed | `autoplay=true&muted=true` is documented; the page also says mobile browsers "generally do not support" autoplay ([cf-player]), which disagrees with WebKit's rules ([webkit-video]). `poster`, `controls` and `defaultTextTrack` are options ([cf-player]). Captions can be uploaded or AI generated ([cf-captions]) | Minutes delivered by video and country; quality figures where "unique viewers" means player sessions, not people ([cf-analytics]). Plays and percent watched: not documented, so unconfirmed |
| Bunny Stream | Your own logo can be added; the docs describe no suggested videos. VAST ads exist only if you set them up ([bunny-player]). Not seen running: unconfirmed | `autoplay=true&muted=true&playsinline=true` documented ([bunny-embed]). `captions=en` turns captions on, auto captions are `en-auto` ([bunny-embed]). Hiding every control: no per-embed setting found, `compactControls` only: unconfirmed. Custom poster: unconfirmed | Views (playback starts per session), watch time, views and watch time by country, a heatmap, and an engagement score by API ([bunny-stats]). No per-viewer data |
| MP4 on Vercel Blob or in the repository | Nothing but your page. | `<video autoplay muted playsinline>` is allowed on iOS and Android Chrome ([mdn-autoplay], [webkit-video]). `poster` attribute for the poster, leave out `controls` to hide them, `<track>` for WebVTT captions ([mdn-video]) | None from the host. All counting is ours, from the page's events |
| MP4 on Cloudflare R2 | Nothing but your page | The same as the other plain MP4 | None from the host |

### Points 7 to 10: Meta Pixel events, Next.js, moving later, cookies

| Option | 7. Reading play and progress in the page, to send with `fbq` later | 8. Next.js path | 9. Moving later | 10. Cookies and privacy |
| --- | --- | --- | --- | --- |
| YouTube (unlisted) | IFrame API: `onStateChange` with PLAYING and ENDED, and `getCurrentTime()` and `getDuration()` ([yt-api]). The API reference lists no time-update event, so progress means polling | `YouTubeEmbed` from `@next/third-parties/google` ([next-3p]), or an iframe with `enablejsapi` and the API. Whether `YouTubeEmbed` exposes the API: unconfirmed | You can download only 720p or 360p MP4s of your own upload, or use Google Takeout ([yt-dl], search summary). Keep your original. URLs are YouTube's. No HLS or MP4 link to reuse | `youtube-nocookie.com` stops views from shaping the viewer's YouTube suggestions and ads ([yt-embed-help]). Which cookies are set, and when: unconfirmed |
| Vimeo | `@vimeo/player`: `play`, `ended`, `progress`, and `timeupdate` with `percent` every 250 ms or so ([vimeo-sdk]) | `@vimeo/player` or a plain iframe ([vimeo-sdk]) | Source file kept only with a paid plan and the setting on before upload ([vimeo-source]). Direct file links need Professional or up ([vimeo-dl], search summary) | `vuid` cookie for 2 years, plus player settings cookies; `dnt=1` leaves only four security cookies ([vimeo-cookies]). `dnt=1` also blocks Vimeo's analytics ([vimeo-params]) |
| Wistia | `<wistia-player>` events `play`, `ended`, `percent-watched-change` ([wistia-events]); React props such as `onPercentWatchedChange` | `@wistia/wistia-player-react` ([wistia-react]) | Download MP4 or uncompressed original per video, export whole folders, or fetch the original by API ([wistia-export], search summary). URLs are Wistia's | No tracking cookies since 2020, it uses localStorage ([wistia-privacy-help]). Privacy Mode is optional, and Wistia's Meta and Google integrations stop receiving data in it until a viewer opts in ([wistia-privacy-help]) |
| Mux | Standard media events from the player element (inferred, since Video.js wraps a media element [mux-vjs]) | `next-video` v2.8.3 ([next-video-npm]) with Mux as its default store, or `@videojs/react` with `@videojs/mux-video` ([mux-vjs]). Mux says its older Mux Player is only maintained and not for new players ([mux-llms]) | Download the original quality master through a temporary link ([mux-master]), static MP4 files ([mux-mp4]), and a standard HLS address that other players can use ([mux-vjs]) | Mux Data sets a first-party cookie by default, and you can turn it off ([mux-privacy]). Cookies from video delivery itself: unconfirmed |
| Cloudflare Stream | `Stream(iframe)` SDK: `play`, `ended`, `timeupdate` and the standard media events ([cf-player-api]) | `@cloudflare/stream-react` ([cf-player]), or the iframe | You cannot download the exact original. You can generate MP4 downloads of the encoded video and use HLS and DASH addresses ([cf-faq], [cf-download], [cf-own-player]). Do not cache or store manifests ([cf-own-player]) | Not documented: unconfirmed. Test in DevTools |
| Bunny Stream | player.js: `play`, `pause`, `ended`, `timeupdate`, `progress` with percent ([bunny-playback], [bunny-next]) | Bunny has a Next.js guide and example app ([bunny-next]) | "Keep original files" setting keeps the original, which can then be downloaded; MP4 fallback files up to 1080p ([bunny-enc], [bunny-mp4]). HLS playlist address works elsewhere (inferred) | No cookie documentation found: unconfirmed. `rememberSettings` stores viewer preferences in the browser, and can be turned off ([bunny-embed]) |
| MP4 on Vercel Blob or in the repository | `<video>` events `play`, `timeupdate`, `ended` ([mdn-video]) | `<video>` tag, or `next-video` ([next-video-npm]). Vercel itself recommends a dedicated video platform for large video ([vercel-video-guide]) | The file is yours. The Blob address is Vercel's | None from a file. Vercel Blob cookies: unconfirmed |
| MP4 on Cloudflare R2 | The same | The same | Same. The address is on your own domain if one is set up ([cf-r2-public]) | None from a file |

## What each option means in practice

### YouTube (unlisted)

**What you get.** A free player that plays well on weak signals, because YouTube makes many quality levels and picks one for each visitor ([yt-quality]). A Next.js component exists that loads a light "poster and play button" first and the real player only after a tap ([next-3p]). Viewing stats are in YouTube Studio ([yt-ret]).

**What you give up.** Control over the screen. After the video, YouTube shows suggested videos. You can ask for only your own channel's videos with `rel=0`, but you cannot turn them off ([yt-params]). YouTube's logo and links remain, and its policy forbids hiding them ([yt-devpol]). In practice a visitor who taps the title or the logo leaves the sales page for YouTube, with the Meta ad click already paid for. 

**What it costs.** $0 ([yt-ads-embed]). Embedded videos follow the channel's ad settings, so keep monetization off and no ads play ([yt-ads-embed]).

**Nonprofit discount.** Not needed. It is free.

**Upload size.** YouTube makes its own copies. Its download gives back only 720p or 360p ([yt-dl]), so upload the best file you have and keep the original.

### Vimeo

**What you get.** A well-liked, ad-free player ([vimeo-compare]) with real marketing features on higher plans: no Vimeo logo, a call-to-action button after the video, forms to collect an email before or after the video, and a good events API ([vimeo-embed-plan], [vimeo-endscreen], [vimeo-sdk]). Captions are made automatically on every plan ([vimeo-compare]).

**What you give up.** Money, and clarity. Vimeo's plans changed in October and November 2026: a Free plan, Creator ($9 to $16), Core ($24.50 to $40), Professional ($71 to $120), and Studio ($400, annual only) ([vimeo-2026]). Public videos are unlimited, but any video you want to embed on your own site is "managed": it counts against a storage and bandwidth cap ([vimeo-managed]). That is fine in size (Free allows 3 GB and 1 TB of bandwidth a month). The problem is the policy. Vimeo's policy lists nonprofits, companies, teams, governments and schools as organizations that must pick a business-use plan ([vimeo-policy]). The only self-serve business plan is Studio ([vimeo-2026]). Vimeo says a person reviews the decision and the account holder gets a chance to respond first ([vimeo-policy]). Still, an individual plan carries the risk of being moved to Studio at the next renewal.

**What it costs.** $400 a month billed annually, which is $4,800 a year ([vimeo-studio]). The individual plans are far cheaper, but the player features are staged: without a paid plan you cannot hide the controls or the Vimeo logo ([vimeo-embed-plan], [vimeo-params]).

**Nonprofit discount.** Vimeo's help center says it offers discounts to nonprofits in the United States, only on regular self-serve plans, and not on Enterprise ([vimeo-discount]). The size of the discount and the way to ask are not on Vimeo's pages: unconfirmed. Vimeo's nonprofit page ([vimeo-nonprofit-page]) says discounts exist for US-based nonprofits and that the exact program is best confirmed with Vimeo's sales team. The 25 percent figure that appears on coupon sites is not from Vimeo and was not used.

**Upload size.** Vimeo makes its own versions, so upload your largest file. An embeddable video counts toward managed storage, which is 3 GB on Free ([vimeo-managed]).

### Wistia

**What you get.** A player built for marketing: ad-free on every plan, `silent-autoplay` that is written for the iOS and Chrome rules ([wistia-attrs]), a poster image option, each control separately switchable, heatmaps on Business, and a React component ([wistia-react]). It adapts quality to the connection and says about 768 kbps is the lowest speed that streams reliably ([wistia-viewing]). It has a Meta Ads integration, but only on Enterprise plans and with the Signals add-on, which makes Business $329 a month billed annually ([wistia-meta], [wistia-pricing]). Events in the page (`percent-watched-change`) work on every plan, so sending events to Meta later does not need that integration ([wistia-events]).

**What you give up.** Free keeps the Wistia logo ([wistia-branding]) and stops playing at 200 GB a month; the embed keeps working for a few days after the limit, then shows a message until the month resets ([wistia-usage]). Business is $79 a month billed annually ([wistia-pricing]), so it is a yearly commitment of about $948 unless the monthly price (not read) is workable for a one-time event. Bandwidth above 1 TB is bought in advance: +1 TB is $150 a month ([wistia-usage]).

**What it costs.** See the cost tables. The Developer plan is a pay-as-you-go option: $0 until 25 GB of storage or 200 GB of bandwidth, then $25 a month plus $0.08 per GB at first ([wistia-dev]). Whether the Developer plan removes the Wistia logo and unlocks the analytics: unconfirmed.

**Nonprofit discount.** Yes. Wistia's billing help page says it discounts nonprofit organizations, and you ask Support with proof of status ([wistia-billing]). The size is not stated: unconfirmed.

**Upload size.** Wistia makes derivatives and shows a smaller standard-definition version at typical embed sizes (640 to 960 px wide), to save bandwidth ([wistia-usage]). The player can only serve resolutions the source supports ([wistia-viewing]). Upload your largest file. The original counts toward storage (25 GB on Free, 250 GB on Business).

### Mux

**What you get.** A video "back end" meant for developers, not a finished website. You upload once, Mux makes an adaptive HLS stream and gives you a playback address ([mux-pricing]). The pieces are: a stream, poster images generated from the video ([mux-images]), an iframe player at `player.mux.com`, or Video.js with a Mux package ([mux-vjs]), and Mux Data for viewing quality and counts, included free while videos stay on Mux ([mux-pricing]). Mux says its older Mux Player for the web is only maintained and should not be used for new players ([mux-llms]). Video.js 10 with `@videojs/mux-video` is what Mux points to now ([mux-vjs]). `next-video` (version 2.8.3, published 2026-10-28) is a React component that stores to Mux by default ([next-video-npm]).

**What you give up.** Work. There is no point-and-click dashboard of "who watched how much" like Wistia's; viewers' watching shows up in Mux Data, and the Meta events come from code in the page. The new Video.js 10 packages are recent: how stable they are is unconfirmed. If the iframe player (`player.mux.com`) is used instead, whether it lets the page read play events is unconfirmed.

**What it costs.** $0 for the first 100,000 minutes delivered each month. Pay as you go adds a $20 monthly credit. Delivery is $0.0008 a minute up to 720p and $0.001 at 1080p. Storage is $0.003 per minute a month at 1080p, and a new video sits in a cheaper "cold" tier until someone first plays it ([mux-pricing]). The Free plan stores only 10 videos and does no live ([mux-plan-page]), so later Event Pages should use pay as you go. A payment card is needed for pay as you go (inferred).

**Nonprofit discount.** Mux offers one-time credits to nonprofit customers, arranged through sales ([mux-pricing]). The amount is unconfirmed.

**Upload size.** Mux keeps a master copy at the quality of the original and builds each stream from it ([mux-master]). Billing is by minutes, not size ([mux-estimate]). Upload your largest file. Use the plus quality level for the VSL (about $0.16 once for a 5 minute 1080p video) because basic is built for a lower target video quality ([mux-pricing]).

### Cloudflare Stream

**What you get.** The simplest bill: you pay $5 a month per 1,000 minutes of stored capacity and $1 per 1,000 minutes delivered, and that includes encoding and traffic ([cf-pricing]). An iframe player and a small SDK (`Stream(iframe)`) with media events ([cf-player-api]), a React component ([cf-player]), HLS and DASH addresses for any player ([cf-own-player]), captions from a file or AI ([cf-captions]), and a poster option ([cf-player]).

**What you give up.** No viewing-stats dashboard of plays or percent watched; analytics are minutes delivered by video and country, plus quality figures ([cf-analytics]). No free tier appears on the pricing page. Cookies from the player are not documented: unconfirmed. For the first 1,000 minutes of capacity you pay $5 even if you store 5 minutes.

**What it costs.** At 5 minutes, 10,000 plays watched fully cost $55 ([cf-pricing]). Mux is cheaper at that volume because of its free 100,000 minutes.

**Nonprofit discount.** Stream's own pricing has none. Cloudflare for Startups opened to 501(c)(3) nonprofits, with up to $250,000 in credits, and its first application window closed December 1, 2025 ([cf-blog-nonprofit]). The current Startups page lists Stream among services credits cover, and does not mention nonprofits ([cf-startups]), so whether a nonprofit can apply now is unconfirmed.

**Upload size.** Stream makes its own versions. Storage and delivery are by duration, not size, up to 30 GB per upload ([cf-pricing], [cf-faq]). You cannot download the exact file you uploaded ([cf-faq]). HDR video is changed to SDR ([cf-faq]). Upload your largest file in the recommended format: MP4, H.264, 8 Mbps at 1080p ([cf-faq]).

### Bunny Stream

**What you get.** The lowest per-gigabyte delivery price among the hosted options and no encoding fee ([bunny-pricing-doc]). An iframe player with adaptive HLS, a quality menu, captions (including AI captions), a watch-time heatmap, and playback by `player.js` events ([bunny-player], [bunny-playback]). A Next.js guide with a working example ([bunny-next]). Statistics for views, watch time and countries ([bunny-stats]).

**What you give up.** Some defaults are surprising: `autoplay` and `preload` both default to true in the embed ([bunny-embed]), so a page can start downloading video before anyone asks. A smaller company with a smaller set of marketing tools: no per-viewer data. Its cookie behavior is not documented where I looked: unconfirmed.

**What it costs.** $0.01 per GB in Europe and North America, up to $0.06 elsewhere, storage $0.01 per GB, $1 minimum a month ([bunny-pricing-doc]). 10,000 full plays of a 5 minute video cost about $12.

**Nonprofit discount.** No program found on bunny.net. The pages found were for startups ("HopStart") and an affiliate program only.

**Upload size.** Bunny re-encodes to the resolutions you switch on, for free, but stores every one of them, and any MP4 fallback or original, so storage can be several times the upload ([bunny-pricing-doc]). Upload the largest file. Do not enable "Early-Play" in a public library because it serves the original openly ([bunny-enc]).

### MP4 from the repository, Vercel Blob or Cloudflare R2

**What you get.** No third party in the page, no logo, no suggested videos, no cookies from a host, and one `<video>` tag. Poster, hidden controls, captions by WebVTT and all events are standard ([mdn-video]). Muted autoplay with `playsinline` is allowed on iPhone and in Chrome ([mdn-autoplay], [webkit-video]).

**What you give up.** Everything adaptive. It is one file at one quality, so a visitor on a weak signal waits or sees the picture stop, and a 244 MB file (5 minutes at 6.5 Mbps) is a lot to ask over a cell connection (inferred). It also costs the most per GB on Vercel at list rate ($0.05 per GB, [vercel-iad1]). Files in the repository: GitHub warns at 50 MiB and blocks files over 100 MiB ([github-large]), and Vercel limits static uploads from the command line to 100 MB (Hobby) or 1 GB (Pro) ([vercel-limits]). Vercel Blob does not cache a file over 512 MB, so a 10 minute 8 Mbps file (600 MB) would fetch from the origin every time and cost more ([vercel-blob-pricing]). Vercel says large videos belong on a video platform ([vercel-video-guide]). Hobby plans are for personal or non-commercial use ([vercel-terms]); the OHP plan was not checked.

**What it costs.** Vercel Blob: see the tables. Cloudflare R2: storage $0.015 per GB, egress free, 10 GB free ([cf-r2-pricing]). Cloudflare's rule is that a self-serve account may not serve video through the CDN unless it uses a paid service such as R2 or Stream ([cf-terms]). A public R2 bucket needs a custom domain, and the `r2.dev` address is for non-production use ([cf-r2-public]).

**Nonprofit discount.** Vercel: no program found; the Open Source Program only helps fully open-source nonprofits and says applications are closed ([vercel-oss]). Vercel Blob: no program found. Cloudflare R2: no separate program (see the Cloudflare note above).

**Upload size.** What you upload is what visitors download. Make a separate web version of the file. At 3 Mbps a 5 minute video is about 112 MB (inferred: 3 / 8 x 300 s). The visitor's phone still gets one fixed quality.

## Which file size to upload

| Option | Does the host re-encode? | What the size you upload changes | What to do |
| --- | --- | --- | --- |
| YouTube | Yes (inferred from its 720p and 360p downloads, [yt-dl]) | Nothing visitors download | Upload the largest, keep the original |
| Vimeo | Yes ([vimeo-adaptive]) | Counts toward managed storage; source kept only with a paid plan ([vimeo-managed], [vimeo-source]) | Upload the largest |
| Wistia | Yes, makes derivatives ([wistia-usage]) | Storage use; player cannot show more than the source has ([wistia-viewing]) | Upload the largest |
| Mux | Yes ([mux-master]) | Nothing in the bill, which is by minutes ([mux-estimate]) | Upload the largest |
| Cloudflare Stream | Yes, up to 30 GB ([cf-faq]) | Nothing in the bill; 8 Mbps recommended for 1080p ([cf-faq]) | Upload the largest |
| Bunny Stream | Yes, free ([bunny-pricing-doc]) | Storage of all copies, plus the original if kept | Upload the largest |
| MP4 (Vercel Blob, repository or R2) | No. Served as is | Directly sets what visitors download, and the GB bill | Upload a smaller web version, about 3 Mbps for 720p |

## Nonprofit discounts, one answer each

| Vendor | Answer | Source |
| --- | --- | --- |
| YouTube | Free | Task statement |
| Vimeo | A US nonprofit discount exists for self-serve plans, size not stated | [vimeo-discount], [vimeo-nonprofit-page] |
| Wistia | A discount exists, ask Support with proof of nonprofit status, size not stated | [wistia-billing] |
| Mux | One-time credits for nonprofits, through sales, amount not stated | [mux-pricing] |
| Cloudflare (Stream, R2) | No Stream-specific program. Startups program with up to $250,000 credits opened to 501(c)(3) nonprofits in 2025, first window closed 2025-12-01; current eligibility unconfirmed | [cf-blog-nonprofit], [cf-startups] |
| Bunny | No program found | Search of bunny.net pages |
| Vercel and Vercel Blob | No nonprofit program found. Open Source Program applies only to fully open-source nonprofits and is closed | [vercel-oss] |

## Page load, in one place

Numbers below are the compressed size of each public script, fetched on 2026-11-15 (measured). They show what a page adds. They do not include the iframe's own page and player code, which loads when the iframe loads. That weight is unconfirmed for every host, because no vendor page gave a number and I did not run a page benchmark.

| Script | Measured size on the wire | Used for |
| --- | --- | --- |
| Wistia `player.js` | 57 KB | Wistia player |
| Mux Data extension `mux-data.js` | 28 KB | Mux Data on Video.js |
| Video.js 10 `video.js` | 15 KB | Player core for Mux. The Mux media file was a 123 byte loader, so its real weight is unconfirmed |
| Vimeo `player.js` SDK | 7.9 KB | Events and control |
| Cloudflare Stream `sdk.latest.js` | 6.3 KB | Events and control |
| Bunny `playerjs` | 4.1 KB | Events and control |
| lite-youtube-embed 0.3.3 | 3.8 KB | YouTube facade |
| YouTube `iframe_api` loader | about 1 KB | Loads more code after it starts |

What this means: the video is near the top of an Event Page, so lazy-loading an iframe saves little. The cheaper pattern on every host is a **facade**: show the poster image and a play button, and create the player only when the visitor taps. That matches the muted autoplay rules, because a tap is a user gesture. Whether a tap-then-create-iframe flow starts playback on iOS without a second tap is unconfirmed for each host and needs a phone test. On the plain MP4 options, `preload="none"` with a `poster` already is a facade ([mdn-video]).

## Recommendation and runner-up

### Recommendation: Mux

**Why.** It meets the main needs for this use. Quality adapts to a phone's signal ([mux-pricing]). No host logo or suggested videos appear in the docs, and the page controls the player. The first 100,000 minutes delivered each month are free, which covers the NYE event at 10,000 plays of a 5 minute video watched fully (50,000 minutes) with half to spare ([mux-pricing]). Pay as you go means no yearly commitment. The video can be downloaded back out as a master file ([mux-master]), and the stream is standard HLS ([mux-vjs]). Nonprofit credits are on offer ([mux-pricing]). There is a React path in `next-video` ([next-video-npm]).

**What choosing it means.**
- Someone builds a small player component, a poster, and the Meta Pixel events (`play`, and percent watched from media events). There is no no-code embed with a stats dashboard.
- Viewing stats live in Mux Data, which is built for playback quality; a dashboard of "plays by percent watched" is unconfirmed. For Meta, our own events are the source of truth.
- The Free plan stores 10 videos. Plan on pay as you go once Event Pages multiply, and a card on file.
- Mux Player (the older component) is only maintained. Use Video.js 10 or `next-video`, and test that they are stable before launch.
- Cost risk is low: 50,000 full plays of a 5 minute video is about $100 a month ([mux-pricing], read 2026-11-15), and a paid month can be switched off.

### Runner-up: Wistia, Business plan

**Why.** It is the better fit if the owner wants a finished marketing tool with per-viewer data, heatmaps, a logo-free player and a React component, and does not want to build the player. Events for Meta can still be read in the page ([wistia-events]). A nonprofit discount exists ([wistia-billing]).

**What choosing it means.**
- $79 a month billed annually ([wistia-pricing], read 2026-11-15), which is $948 for a year, before any nonprofit discount (size unconfirmed). The monthly price was not read.
- A cap of 1 TB a month, so a 5 minute video at 10,000 full plays (about 1.25 TB at my assumption) already needs an add-on ($150 a month for +1 TB) ([wistia-usage]).
- Wistia's own Meta integration needs the Signals add-on, which makes the plan $329 a month billed annually ([wistia-meta], [wistia-pricing]). Our own events work without it.
- Viewer data tied to an email address (`email`) goes to a third party. Privacy Mode makes viewers anonymous and breaks that link ([wistia-privacy-docs]).

### Also viable, and why not first

- **Bunny Stream** is the cheapest per play after 100,000 minutes (about $62 for 50,000 full plays of 5 minutes, [bunny-pricing-doc], read 2026-11-15). It is a close third. It was not chosen because its cookie behavior and several controls are undocumented where I looked and the free quota of Mux is better at this volume.
- **YouTube** is the fastest and cheapest start, and the one to use if launch day comes first. Its cost is a sales page with the YouTube brand and links on it.
- **Vimeo** is not recommended for a nonprofit unless the owner is willing to pay for Studio, or accept the risk of an individual plan.
- **Cloudflare Stream** is a good second to Mux if the owner wants one flat, easy-to-predict bill ($5 plus $1 per 1,000 minutes, [cf-pricing], read 2026-11-15) and does not need a stats dashboard.
- **Plain MP4** should only be a fallback, and a smaller web file.

## Cookies and consent for a US 501(c)(3) running Meta ads

This is a summary of what the hosts document. It is not legal advice, and I did not research Meta's Pixel itself, which is the larger tracking question on the page.

- **Hosts that set tracking by default.** YouTube's normal embed and Vimeo without `dnt=1` set cookies that identify the viewer to the host ([vimeo-cookies], [yt-embed-help]). `youtube-nocookie.com` limits personalization; whether it sets cookies before play is unconfirmed ([yt-embed-help]).
- **Hosts that document no tracking cookies.** Wistia since 2020 ([wistia-privacy-help]). Mux sets a first-party cookie through Mux Data unless turned off ([mux-privacy]). Cloudflare Stream and Bunny: not documented.
- **Where a consent banner would matter (inferred).** If any visitors may come from the EU or UK, a tracking embed such as standard YouTube should be blocked until a banner choice. In the US a federal rule requiring a banner was not found in this research. Some state privacy laws reach nonprofits and some do not; which apply to OHP is unconfirmed. If a banner is used for the Meta Pixel, put the video player behind the same gate unless the host sets no tracking.
- **The Video Privacy Protection Act.** The federal law makes a video service provider liable for knowingly disclosing personally identifiable information about a person who requested specific video materials ([vppa]). Mux's privacy page says Mux Data complies with it ([mux-privacy]). Whether a nonprofit's sales video, with titles sent to Meta alongside an identity, falls under it is unconfirmed and a question for counsel before the play events are sent to Meta.
- **Meta events from the page.** With a host that sets no cookie and a page that sends `fbq` events only after consent, the video host adds little privacy exposure. The exposure is in what the page sends.

## Unconfirmed

- The video's running time, which was given as 4:35:19 and read as 4 minutes 35 seconds. The cost tables use 3, 5 and 10 minutes.
- The average watch fraction. The 40 percent column is my assumption.
- Extra delivery from preloading and buffering that billing counts but nobody watches. Its size per host.
- The delivered bitrate of each adaptive host on phones. 3.33 Mbps is an assumption. Wistia's smaller default may lower its numbers.
- The size of the iframe's own page and player code for YouTube, Vimeo, Wistia, Cloudflare Stream and Bunny, and the real size of Mux's player parts. No benchmark was run.
- Whether a tap on a facade starts playback on iOS without a second tap, for each host.
- What a visitor's tap does during muted autoplay (unmute, pause, or nothing) for each host. No vendor page I read says.
- Vimeo's nonprofit discount size and how to claim it. Whether Vimeo would allow a nonprofit onto an individual plan.
- Whether Vimeo's custom poster and Wistia's caption upload work the way the docs imply. Neither page was read.
- Wistia: the monthly price of Business, the overage rate per GB on Business, what the Developer plan includes (logo, analytics), the size of the nonprofit discount.
- Mux: whether Mux Data's dashboard shows percent watched and per-viewer data, whether the Free plan includes Mux Data, what happens on the Free plan beyond 100,000 minutes, whether the `player.mux.com` iframe exposes play events, how stable Video.js 10 is, the nonprofit credit amount, and whether a card is needed for pay as you go.
- Cloudflare Stream: cookies set by the player, whether any Cloudflare logo shows, how a plays count can be had, whether OHP is eligible for the Cloudflare for Startups nonprofit credits now.
- Bunny Stream: cookies set by the player, a way to hide all controls on one embed, a custom poster option, and any nonprofit program.
- YouTube: when cookies are set with `youtube-nocookie.com`, how embedded views show in Studio reports, a `mute` URL parameter (not on the parameters page), custom thumbnail steps, and whether `YouTubeEmbed` gives access to the player API.
- Vercel: which plan OHP is on and whether Blob data transfer falls under the Pro flat-rate tier, and whether a Blob address can sit on a custom domain.
- Which US state privacy laws apply to OHP, and whether the VPPA applies to the page.

[mux-pricing]: https://www.mux.com/docs/pricing.txt
[mux-estimate]: https://www.mux.com/docs/pricing.txt
[mux-plan-page]: https://www.mux.com/pricing
[mux-llms]: https://www.mux.com/llms.txt
[mux-vjs]: https://www.mux.com/docs/guides/playback-videojs-with-mux.md
[mux-master]: https://www.mux.com/docs/guides/download-for-offline-editing.md
[mux-mp4]: https://www.mux.com/docs/guides/enable-static-mp4-renditions.md
[mux-images]: https://www.mux.com/docs/guides/get-images-from-a-video.md
[mux-privacy]: https://www.mux.com/docs/guides/ensure-data-privacy-compliance.md
[next-video-npm]: https://registry.npmjs.org/next-video
[next-3p]: https://nextjs.org/docs/app/guides/third-party-libraries.md
[yt-params]: https://developers.google.com/youtube/player_parameters
[yt-api]: https://developers.google.com/youtube/iframe_api_reference
[yt-embed-help]: https://support.google.com/youtube/answer/171780?hl=en
[yt-ads-embed]: https://support.google.com/youtube/answer/132596?hl=en
[yt-dl]: https://support.google.com/youtube/answer/56100?hl=en
[yt-quality]: https://support.google.com/youtube/answer/91449?hl=en
[yt-ret]: https://support.google.com/youtube/answer/9314415?hl=en
[yt-devpol]: https://developers.google.com/youtube/terms/developer-policies
[vimeo-2026]: https://help.vimeo.com/hc/en-us/articles/52596250640785-About-changes-to-Vimeo-plans-in-2026
[vimeo-managed]: https://help.vimeo.com/hc/en-us/articles/51688797787281-About-managed-storage-on-Vimeo
[vimeo-compare]: https://help.vimeo.com/hc/en-us/articles/12425432033937-About-Vimeo-plans
[vimeo-studio]: https://help.vimeo.com/hc/en-us/articles/47197205924241-About-the-Vimeo-Studio-plan
[vimeo-embed-plan]: https://help.vimeo.com/hc/en-us/articles/12426275096337-Understanding-video-embedding-features
[vimeo-params]: https://help.vimeo.com/hc/en-us/articles/12426260232977-About-Player-Parameters
[vimeo-endscreen]: https://help.vimeo.com/hc/en-us/articles/12426231346449-About-end-screens
[vimeo-sdk]: https://github.com/vimeo/player.js
[vimeo-cookies]: https://help.vimeo.com/hc/en-us/articles/26080940921361-Vimeo-Player-Cookies
[vimeo-policy]: https://vimeo.com/legal/policies/plan-usage
[vimeo-discount]: https://help.vimeo.com/hc/en-us/articles/12425463134865-Discounts-and-Programs
[vimeo-nonprofit-page]: https://vimeo.com/product/video-hosting-for-nonprofits
[vimeo-dl]: https://help.vimeo.com/hc/en-us/articles/12426502581265-How-to-download-a-video-on-Vimeo
[vimeo-source]: https://help.vimeo.com/hc/en-us/articles/46427284891537-Store-your-source-files-on-Vimeo
[vimeo-adaptive]: https://help.vimeo.com/hc/en-us/articles/12425768654225-Troubleshoot-playback-quality-and-buffering-issues
[vimeo-analytics]: https://help.vimeo.com/hc/en-us/articles/46427526982545-Analytics-Glossary
[wistia-pricing]: https://wistia.com/pricing
[wistia-usage]: https://support.wistia.com/en/articles/8264552-account-usage-and-bandwidth
[wistia-dev]: https://wistia.com/pricing/developer-plan
[wistia-billing]: https://support.wistia.com/en/articles/12301943-billing-troubleshooting
[wistia-attrs]: https://docs.wistia.com/docs/player-attributes-and-properties.md
[wistia-events]: https://docs.wistia.com/docs/player-events.md
[wistia-react]: https://docs.wistia.com/docs/player-react-component.md
[wistia-privacy-docs]: https://docs.wistia.com/docs/player-privacy-mode.md
[wistia-privacy-help]: https://support.wistia.com/en/articles/8264955-privacy-data-protection-and-security
[wistia-meta]: https://support.wistia.com/en/articles/8230073-reach-retarget-for-meta
[wistia-viewing]: https://support.wistia.com/en/articles/8240257-wistia-viewing-requirements
[wistia-branding]: https://support.wistia.com/en/articles/8284308-appearance-brand
[wistia-export]: https://support.wistia.com/en/articles/8264610-media-management
[wistia-delivery]: https://wistia.com/support/embed-and-share/media-delivery
[cf-pricing]: https://developers.cloudflare.com/stream/pricing/index.md
[cf-player]: https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player/index.md
[cf-player-api]: https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player/using-the-player-api/index.md
[cf-own-player]: https://developers.cloudflare.com/stream/viewing-videos/using-own-player/index.md
[cf-faq]: https://developers.cloudflare.com/stream/faq/index.md
[cf-analytics]: https://developers.cloudflare.com/stream/getting-analytics/fetching-bulk-analytics/index.md
[cf-download]: https://developers.cloudflare.com/stream/viewing-videos/download-videos/index.md
[cf-enhance]: https://developers.cloudflare.com/stream/edit-videos/player-enhancements/index.md
[cf-captions]: https://developers.cloudflare.com/stream/edit-videos/adding-captions/index.md
[cf-blog-nonprofit]: https://blog.cloudflare.com/expanding-startups-for-nonprofits/
[cf-startups]: https://www.cloudflare.com/forstartups/
[cf-r2-pricing]: https://developers.cloudflare.com/r2/pricing/index.md
[cf-r2-public]: https://developers.cloudflare.com/r2/buckets/public-buckets/index.md
[cf-terms]: https://www.cloudflare.com/service-specific-terms-application-services/
[bunny-pricing-doc]: https://bunny.net/docs/stream/pricing.md
[bunny-cdn]: https://bunny.net/pricing/cdn/
[bunny-player]: https://bunny.net/docs/stream/player.md
[bunny-embed]: https://bunny.net/docs/stream/embedding.md
[bunny-playback]: https://bunny.net/docs/stream/playback-api.md
[bunny-stats]: https://bunny.net/docs/stream/statistics.md
[bunny-enc]: https://bunny.net/docs/stream/encoding.md
[bunny-mp4]: https://bunny.net/docs/stream/mp4-downloads.md
[bunny-next]: https://bunny.net/docs/stream/player/nextjs.md
[vercel-blob-pricing]: https://vercel.com/docs/vercel-blob/usage-and-pricing.md
[vercel-iad1]: https://vercel.com/docs/pricing/regional-pricing/iad1.md
[vercel-pro]: https://vercel.com/docs/plans/pro-plan.md
[vercel-limits]: https://vercel.com/docs/limits.md
[vercel-terms]: https://vercel.com/legal/terms
[vercel-oss]: https://vercel.com/open-source-program
[vercel-video-guide]: https://vercel.com/kb/guide/best-practices-for-hosting-videos-on-vercel-nextjs-mp4-gif.md
[github-large]: https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
[mdn-autoplay]: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
[mdn-video]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video
[webkit-video]: https://webkit.org/blog/6784/new-video-policies-for-ios/
[vppa]: https://www.law.cornell.edu/uscode/text/18/2710
