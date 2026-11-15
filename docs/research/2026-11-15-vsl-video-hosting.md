# Where to host the VSL video for Event Pages

Research memo for issue 2, written 2026-11-15 and revised the same day (see "What changed in this revision"). Every source below was read on 2026-11-15 unless a line says otherwise.

## What changed in this revision

Revised 2026-11-15. The owner asked for free hosting options, for a check of whether HighLevel (GoHighLevel, GHL) can store the file, and for a clean player to be the main weight.

- **Added three sections:** "Free options" (24 services), "Using the HighLevel media library", and "Bring your own player" (open-source players over a plain video file, with one `ffmpeg` command).
- **Added rows** for every new option in the cost, comparison, file size, page load and nonprofit tables. Added a table of how many plays each free cap covers.
- **Recommendation: Mux stays first.** Among everything found, it is the only option that is free at this volume, clean, and adaptive on a weak signal.
- **Runner-up changed** from Wistia (Business) to a free route: a phone-friendly MP4 stored in the HighLevel Media Library or Cloudflare R2, played by Video.js 10. Wistia moved to "also viable" because its free plan keeps the Wistia logo and the plan that removes it costs $79 a month.
- **Corrected:** the first version said a payment card was needed for Mux pay as you go (inferred). Mux's pricing page says "No credit card to start" ([mux-plan-page]). The first version listed Video.js 10 stability as unconfirmed. Its own README now says v10 "is stable" ([videojs-readme]).
- **Not changed:** every earlier price, cap and conclusion that this pass did not re-read.

## Short answer

**Recommendation: Mux, shown in a clean Video.js 10 player. This is unchanged from the first version.** It wins on the three things that now matter most.

1. **The player is clean.** The docs read show no host logo and no suggested videos, and you choose the controls ([mux-vjs]).
2. **It costs $0 at this scale.** The first 100,000 minutes delivered each month are free ([mux-pricing]), and Mux's pricing page says "No credit card to start" ([mux-plan-page]). For the working case (a 5 minute video), that covers 20,000 plays watched to the end, or 50,000 plays if the average visitor watches 40 percent. Above that it costs about $0.0008 per minute delivered. 50,000 full plays of a 5 minute video cost about $100 a month. Mux also offers one-time credits to nonprofits ([mux-pricing]).
3. **It adapts to a weak phone signal.** It plays the video in short pieces at the quality a phone connection can hold. This is called adaptive bitrate: the video is made in several quality levels and the player switches between them as the signal changes.

**Runner-up (changed): a free "bring your own player" route.** Make a phone-friendly 720p copy of the video with one `ffmpeg` command (given in "Bring your own player"). Keep that file in the HighLevel Media Library to start, or in Cloudflare R2 behind your own domain. Play it with Video.js 10, which is open source (Apache-2.0, [videojs-license]) and ships a skin its docs call "plain, unbranded" ([videojs-compat]). The visitor sees your page and a play button, nothing from a host. Cost: $0 extra. The trade is that the visitor gets one quality, not several. The first version of this memo named Wistia (Business, $79 a month billed annually) as the runner-up. Wistia is now "also viable": its free plan keeps the Wistia logo ([wistia-pricing]), and a clean player needs the paid plan.

**Can the free route match Mux on a weak phone signal? Not fully.** In plain terms:

- Mux makes several quality levels and moves the viewer between them as the signal changes. A weak signal gets a softer picture that keeps playing.
- A single MP4 file has one quality. Two settings narrow the gap but do not close it.
- **Faststart.** An MP4 normally keeps its index (the "moov atom") at the end of the file, so a phone must fetch the end before it can start. `faststart` moves the index to the front ([ffmpeg-formats]).
- **HTTP range requests.** The phone asks the server for a slice of the file instead of all of it. That lets playback start before the whole file arrives and lets the visitor skip ahead ([mdn-range]). HighLevel's storage answered a range request correctly on the one file I tested (measured, see "Using the HighLevel media library").
- **What stays missing (inferred).** If the signal drops below what the file needs, the picture pauses to buffer. It cannot step down to a lower quality. A 720p file made by the command below needs about 2.6 Mbps at most, and is about 100 MB for 5 minutes. A visitor on a good 4G or Wi-Fi connection will not notice. A visitor below roughly 2 Mbps will see pauses where Mux would show a softer picture.

For an audience arriving from Meta ads on phones, that is the real price of "free and clean" without Mux. If the owner would rather have no new account and no card, and accepts that price, the free route is sound.

**HighLevel can store the file, and our own player can play it.** Documented limits: 4 GB per video in the Media Library ([hl-limits]). Files uploaded normally are public ([hl-limits]). I measured one public HighLevel media file: it answered range requests and allowed any website to load it ([hl-measured]). I found no clause in HighLevel's terms against playing a stored file on another site ([hl-tos]). Caveats: the address is on a HighLevel host, not our domain ([hl-domain-idea]); HighLevel keeps data only 90 days after an account ends ([hl-tos]); no storage or bandwidth cap is published, but a Fair Use Policy applies to "unlimited" plans ([hl-tos]); and I measured an image, not a video. A five minute phone test settles it (steps in "Using the HighLevel media library").

Four things that change the picture:

1. **Vimeo is the expensive trap.** Vimeo's own policy says an account used by a nonprofit has to be on a business plan ([vimeo-policy]). The only self-serve business plan is Studio, at $400 a month billed annually, or $4,800 a year ([vimeo-studio]). Vimeo's cheap individual plans ($0 to $71 a month, [vimeo-2026]) are meant for single people.
2. **YouTube cannot be made clean.** The `rel=0` setting no longer turns off suggested videos. It only limits them to the same channel ([yt-params]). The `modestbranding` setting, which hid the logo, now does nothing ([yt-params]), and YouTube's policy forbids removing or hiding links in its player ([yt-devpol]). A visitor can always click out of the page.
3. **Free streaming plans keep their logo or have caps that are too small.** Wistia Free, Vimeo Free, Gumlet Free and Loom Starter keep the host's branding ([wistia-pricing], [vimeo-embed-plan], [gumlet-blog], [loom-pricing]). The image and file services (ImageKit, Cloudinary, Uploadcare, Supabase) cap video files at 50 to 500 MB and traffic at 5 to 25 GB a month. See "Free options" and the free-cap table.
4. **A plain MP4 is the worst choice for a weak phone signal, and the size you upload is the size visitors download.** A 5 minute 1080p file at about 6.5 Mbps is about 244 MB. It has one quality and no adjusting. The fix is a smaller web copy (about 100 MB) rather than the original. On Vercel Blob the list rate is $0.05 per GB delivered ([vercel-iad1], read 2026-11-15).

The owner's own file decides little for most hosts. Mux, Cloudflare Stream, Bunny, Vimeo, Wistia and YouTube all re-encode what you upload, so upload the largest, best file. Only the plain MP4 options serve your file as it is, so those get the smaller web copy. See "Which file size to upload".

## Free options

Every free way to host the video that I could find from a vendor's own page. "Free" is stated exactly: **free forever** (no time limit, up to a cap), **free trial** (stops after a time), **included** (comes with something you already pay for) or **not free**. Each row says whether it is usable for a sales video on our page. All sources were read on 2026-11-15.

Words used: **egress** is data sent out to visitors. **Hotlinking** is showing a file stored on one site inside a page on another site. **HTTP range request** is the phone asking the server for part of a file, so playback can start early and skipping works. **HLS** is a common way of delivering adaptive video as many short pieces.

| Option | What is free, precisely | The cap | The catch for a sales video on our page | Source (read 2026-11-15) |
| --- | --- | --- | --- | --- |
| YouTube (unlisted) | Free forever | No bandwidth cap on the pages read | YouTube's logo, links and suggested videos cannot be removed ([yt-devpol]). Not clean | [yt-params], [yt-ads-embed] |
| Vimeo Free | Free forever | 1 TB a month managed bandwidth, 3 GB managed storage | Vimeo logo shows on Free. Vimeo's policy says a nonprofit must use a business plan | [vimeo-2026], [vimeo-managed], [vimeo-embed-plan], [vimeo-policy] |
| Wistia Free | Free forever | 25 GB storage, 200 GB bandwidth a month. At the limit, embeds keep playing a few days, then stop until the month resets | Wistia logo cannot be turned off. Not clean | [wistia-pricing], [wistia-usage] |
| Mux | Free forever up to 100,000 minutes delivered a month. Pay as you go adds a $20 monthly credit. Pricing page says "No credit card to start" | Free plan stores 10 videos | Clean when played in Video.js. Adaptive. Above 100,000 minutes, $0.0008 a minute | [mux-pricing], [mux-plan-page] |
| Cloudflare Stream | Not free. No free tier or trial on the pricing page | Not applicable: $5 per 1,000 stored minutes, $1 per 1,000 delivered | Paid from the first minute | [cf-pricing] |
| Cloudflare R2 (file storage) | Free forever up to the monthly allowance | 10 GB-month stored, 1 million Class A and 10 million Class B requests a month, egress free | A public bucket on your own domain needs a domain that is a Cloudflare zone in the same account (a partial CNAME setup if DNS is elsewhere). The `r2.dev` address is rate limited and for development only. Whether a free account can enable R2 without a card: unconfirmed | [cf-r2-pricing], [cf-r2-public] |
| Cloudflare Pages assets | Free forever | 25 MiB per file, 20,000 files per site | A 5 minute video is far over 25 MiB (about 100 MB). Cannot hold the file | [cf-pages-limits] |
| Bunny Stream or Bunny Storage | Free trial, not free forever. 14 days, $20 of credit without a card, $30 more once billing details are added | Credits expire at the end of the trial and cannot be carried over | After the trial, $0.01 per GB in Europe and North America, $1 minimum a month | [bunny-quickstart], [bunny-pricing-doc] |
| Vercel Blob on Hobby | Free forever within the allowance | 1 GB stored, 10 GB data transfer a month, 10,000 simple operations. At the limit Blob stops working for up to 30 days. No charge | The Hobby plan is for personal or non-commercial use ([vercel-terms]). Whether a nonprofit's marketing page counts: unconfirmed. 10 GB is only 88 full plays of a 5 minute web file | [vercel-blob-pricing], [vercel-terms] |
| Backblaze B2 | Free forever for the first 10 GB stored. Whether a card is needed to sign up: unconfirmed | Free egress up to 3 times the monthly average stored data, then $0.01 per GB | One 100 MB file earns only about 300 MB of free egress, so after about 3 plays you pay $0.01 per GB. 10,000 full plays of 5 minutes cost about $11. Range requests are documented | [b2-pricing], [b2-txn], [b2-range] |
| GitHub Releases | Free | Each file under 2 GiB. "No limit on the total size of a release, nor bandwidth usage" | GitHub may throttle "significantly excessive" bandwidth. The download is sent as `application/octet-stream` with `content-disposition: attachment` (measured). Whether phones play a video from it: unconfirmed. Not meant as a video host (inferred) | [gh-releases], [gh-aup], [gh-release-measured] |
| GitHub Pages | Free | 1 GB site, 100 GB a month soft bandwidth limit | Not "allowed to be used as a free web-hosting service to run your online business" or to facilitate commercial transactions. A file over 100 MiB is blocked in a repository ([github-large]) | [gh-pages-limits], [github-large] |
| Internet Archive | Free | Terms could not be read: unconfirmed | A public library. The terms page needs a script to show, so I could not read it. Whether a sales video is allowed: unconfirmed | [ia-terms], [ia-rights] (search summary) |
| HighLevel Media Library | Included in the HighLevel plan the owner already pays for | 4 GB per video. No storage or bandwidth cap published | Address is on a HighLevel host. See the next section | [hl-limits], [hl-pricing], [hl-tos] |
| Loom Starter | Free forever | 25 videos per person, 5 minutes per recording. Bandwidth cap not stated | The video is 4:35 (to be confirmed), so it only just fits. Loom branding stays (removal is listed only for the Business plan, $18 per user per month) | [loom-pricing] |
| Streamable | Free forever, from a search summary of its pricing page (the page did not load) | 250 MB and 10 minutes per video. Deleted after 90 days | "Ads will appear next to your videos" on the free plan. Disqualified | [streamable-pricing] (search summary) |
| Google Drive | Free with the Google account's storage | No number published. A "too many users have viewed or downloaded" block lasts about 24 hours | Google tells owners to use "Google Cloud Storage or dedicated hosting" for large media. Not for paid traffic | [drive-limit] |
| Dropbox | Included with the account | Shared links per day: Basic and Simple 20 GB and 100,000 downloads. Plus, Family, Professional, Essentials, Standard and Business 1 TB. Advanced, Business Plus and Enterprise 4 TB | Over the limit, sharing and links pause 24 hours, longer if repeated. Whether a marketing page may play from a Dropbox link: unconfirmed | [dropbox-banned] |
| ImageKit | Free forever | 20 GB bandwidth and 500 video units a month, 3 GB stored, 100 MB largest video | 100 MB is below the size of a 5 minute 3 Mbps file (112 MB). 20 GB covers 177 full plays of 5 minutes | [imagekit-plans] |
| Cloudinary | Free forever | 25 credits a month. One credit is 1 GB of storage, or 1 GB of image bandwidth, or 1,000 transformations. Video bandwidth credits are listed for paid plans. 100 MB largest video on Free (search summary) | Free credits for delivering video: unconfirmed. The 100 MB file cap blocks a 5 minute 3 Mbps file | [cloudinary-plans], [cloudinary-size] (search summary) |
| api.video | Free sandbox only, not free in practice | Videos limited to 30 seconds, watermarked with the api.video logo, deleted after 24 hours | Unusable for a real video. Pay as you go: $0.0017 per minute delivered, $0.00285 per minute stored (both "as low as"), encoding free | [apivideo-pricing] |
| Gumlet Free | Free forever | 60 minutes stored, 100 GB streaming bandwidth a month | Gumlet logo stays on Free. Creator is $6 a month billed annually, $9 monthly | [gumlet-blog] |
| Uploadcare Free | Free forever | 5 GB traffic, 1 GB storage, 1,000 operations a month, 500 MB largest file. Adaptive bitrate streaming is listed on Free | 5 GB covers only 44 full plays of 5 minutes. Pro is $66 a month billed yearly, $79 monthly. The player's look: unconfirmed | [uploadcare-pricing] |
| Supabase Storage | Free forever | 1 GB stored, 5 GB cached plus 5 GB uncached egress a month (search summary), 50 MB largest file. No overage charge, a grace period instead | 50 MB for 5 minutes means at most 1.3 Mbps, a soft picture | [supabase-limits], [supabase-egress] (search summary) |

What the table says:

- **Free, clean and adaptive:** Mux only, at this volume.
- **Free, clean, one quality, no practical cap:** HighLevel Media Library (included in the plan, no published cap) and Cloudflare R2 (10 GB free, free egress). GitHub Releases also has no stated cap, but its delivery headers and terms make it the riskiest of the three.
- **Free, clean, small cap:** Vercel Blob Hobby (and its non-commercial limit), Backblaze B2, Supabase, ImageKit, Cloudinary and Uploadcare. All run out within a few hundred plays or a file-size limit.
- **Free but not clean:** YouTube, Vimeo Free, Wistia Free, Gumlet Free and Loom Starter keep logos or links. Streamable adds ads.
- **Not free in practice:** Cloudflare Stream, api.video (sandbox only) and Bunny (14-day trial).
- **Cannot hold the file:** Cloudflare Pages assets (25 MiB per file) and Google Drive and Dropbox for paid traffic (daily limits and a "too many users" block).

## Using the HighLevel media library

The owner has a HighLevel account and can store the file there. The question was whether HighLevel stores it in a way our own Next.js page can use, and whether HighLevel gives a player. Every answer below says whether it is **documented** (HighLevel's own page), **measured** (I sent a read-only request to a public file), **inferred** (my reasoning) or **unconfirmed**. I did not log in, upload anything or use any HighLevel connector. Only public documentation and one public file were used. All sources read 2026-11-15.

| Question | Answer | Basis | Source (read 2026-11-15) |
| --- | --- | --- | --- |
| Where are files stored? | In Google Cloud Storage. The upload API describes the returned link as a "Google Cloud Storage URL of the uploaded file". A public file's response headers showed Google storage markers (`x-goog-*`) with Cloudflare in front | Documented, measured | [hl-api-upload], [hl-measured] |
| Maximum upload for video? | 4 GB per video in the Media Library and in Sites and Funnels (Courses 5 GB, Social Planner 1 GB). Through the API, 25 MB for ordinary files and 500 MB for video. An article from August 2026 gives "File size exceeds 50MB limit for videos" as an example error message, which disagrees. It is only an example, and the limits article (modified 2026-09-25) is newer and specific. The owner's upload will show which is true | Documented, with a conflict | [hl-limits], [hl-api-upload], [hl-filetypes] |
| Limits by file type? | Video types listed: AVI, MOV, MP4, MPEG, OGV, WMV/ASF, WebM. Verified in Chrome, Firefox and Safari: MP4, MOV, WebM, WMV, AVI, M4V. Browser playback inline: MP4 and WebM with H.264 or VP9. Images, audio and documents: 100 MB each | Documented | [hl-limits], [hl-filetypes] |
| Does each file get a public direct URL? | Yes. Files uploaded normally are public. Only files uploaded through the Digital Product setup are private, with links that expire after 10 minutes | Documented | [hl-limits] |
| What is the host? | `assets.cdn.filesafe.space/<account id>/media/<file id>.<ext>` appears in a public HighLevel Ideas post. The API docs show a `storage.googleapis.com` address. Which one the Media Library's copy-link button gives: unconfirmed (I cannot log in) | Measured, documented | [hl-url-example], [hl-api-upload], [hl-domain-idea] |
| Can it use our own domain? | No. A request to point media links at a branded domain has 52 votes and no stated status. A commenter says some corporate firewalls block the filesafe domain, and that it can look like spam | Documented (request page) | [hl-domain-idea] |
| Is the URL stable and permanent? | Stable while the account lives: editing a file keeps its public URL, and deleted files stay in Trash 30 days. Not permanent beyond the account: after termination HighLevel keeps data 90 days, then may delete it. Accounts inactive for 90 days may be deleted. HighLevel disclaims any duty for "deletion or failure to store" content | Documented | [hl-limits], [hl-import], [hl-tos] |
| Does it support HTTP range requests? | Yes on the one file tested. A request for `Range: bytes=0-1` returned status 206 with `accept-ranges: bytes`. That file was a 1.15 MB image, not a video. No public HighLevel video was found. The same host serves video (inferred) | Measured | [hl-measured] |
| Can it be the source of a plain `<video>` on another site? CORS? | The response carried `access-control-allow-origin: *` and `cache-control: public, max-age=31536000` (one year), so any site can load it. A plain `<video src>` needs no CORS permission anyway. Whether HighLevel accepts ad traffic playing a video from its storage: unconfirmed | Measured; inferred | [hl-measured], [mdn-video] |
| Do the terms forbid hotlinking? | I searched the Terms of Service (last updated June 2026) for "hotlink", "bandwidth", "content delivery" and "video hosting" and found no such clause. The Code of Conduct bans use that could "disable, overburden, damage, or impair the Platform". HighLevel decides what is excessive | Documented | [hl-tos] |
| Any bandwidth or storage cap or fair-use clause? | The pricing page lists no storage, media or bandwidth limit for any plan. The Media Usage modal shows how much storage an account uses, but the allowance is not published. The terms say plans "marketed as unlimited" fall under a Fair Use Policy, and HighLevel may "throttle, pause, suspend or terminate" use it judges excessive or require a plan upgrade. On the pricing page, "unlimited" names contacts, users and sub-accounts, not storage | Documented | [hl-pricing], [hl-limits], [hl-tos] |
| Which plans exist? | Starter $97 a month (3 sub-accounts), Unlimited $297 a month, Pro $497 a month (the card is labelled Founder). The yearly prices on the page look transposed between plans, so I did not use them. Which plan the owner holds: unconfirmed | Documented | [hl-pricing] |
| Does HighLevel transcode or serve as uploaded? | The Media Library serves the file as uploaded (inferred from HighLevel saying raw videos "can only play in one quality"). The Hosted Video element makes 480P, 720P, 1080P and Auto copies when you double-click the file to start encoding. Where those copies live and their addresses: unconfirmed | Documented, inferred | [hl-hosted-video] |
| Does HighLevel have a native player? | Yes: the Video element with type "Hosted Video" in the funnel and website builder. Documented controls: autoplay (muted, by browser rules), play and pause, speed 0.5x to 2x, pending time, full-screen, progress bar (can be hidden so viewers cannot seek), quality choice, picture-in-picture, a form that pauses the video at a set time, and a redirect for visitors who are not yet contacts. Its libraries load only when the video plays or autoplay is on | Documented | [hl-hosted-video], [hl-leadgen], [hl-pip], [hl-lazy] |
| What does that player look like? Logo? Branding? | The help pages do not say. Logo, branding and skin: unconfirmed. I did not find a "Custom video player" feature in the HighLevel docs | Unconfirmed | [hl-hosted-video] |
| Can HighLevel's player be used on our Next.js page? | Not documented. It is configured inside HighLevel funnels and websites. A way to embed it elsewhere: unconfirmed. Treat it as unavailable (inferred) | Inferred | [hl-hosted-video] |

**Answer to the owner's question: yes, in principle.** The stored file has a public address, answered a range request, allowed other sites to load it, and the terms I read do not forbid playing it elsewhere. A Video.js 10 or plain `<video>` player on our Next.js page can use that address as its source. HighLevel gives you the storage but no usable player for our own page, which is what you suspected.

**Caveats, most important first:**

1. **I measured an image, not a video.** A phone test with the real file closes this (steps below).
2. **One quality only.** HighLevel serves the file as uploaded, so the weak-signal point in the short answer applies in full.
3. **The address is not ours** and cannot be put on our domain. If HighLevel changes its storage host, the page breaks. Store the address in one place and keep the original file.
4. **If the HighLevel subscription ends, the file can be deleted** after 90 days ([hl-tos]). A sales page that runs after the account lapses would lose its video.
5. **Firewalls.** One commenter reports corporate firewalls blocking the host ([hl-domain-idea]). This matters little for phones on mobile data and more for visitors on office networks.
6. **A cookie on the media host.** The one response I checked set a Cloudflare `__cf_bm` cookie on `filesafe.space` (measured). That is a third-party cookie for the visitor. Its purpose is inferred (Cloudflare's bot protection).
7. **No published cap, but a Fair Use Policy.** Ad traffic playing a 100 MB file thousands of times is heavier than most HighLevel storage use. Where HighLevel draws the line: unconfirmed.

**A phone test the owner can do in ten minutes** (no coding): make the 720p file below, upload it to the Media Library, open the file's public link on a phone on mobile data (not Wi-Fi), and check three things. Does it start playing before the whole file has loaded? Can you drag the bar ahead and have it continue within a few seconds? Does it work in Safari on an iPhone and in Chrome on Android? If all three work, a player on our page can use that address. If the page asks to download the file instead of playing it, use Cloudflare R2 instead.

## Bring your own player

"Bring your own player" means the video file sits in plain storage and our page shows it with a player we choose. The player draws the buttons and the progress bar. The storage only sends the file. This is how to get a clean player without a video host.

### Storage choices for the file

| Storage | Cost for this video | Range requests | Own domain | Main catch | Source (read 2026-11-15) |
| --- | --- | --- | --- | --- | --- |
| HighLevel Media Library | $0 extra | Yes (measured on an image) | No | Not ours, deleted if the account ends | [hl-measured], [hl-domain-idea], [hl-tos] |
| Cloudflare R2 | $0 (10 GB free, egress free) | Unconfirmed (the pages read do not say) | Yes, needs a Cloudflare zone | Account and domain set-up | [cf-r2-pricing], [cf-r2-public] |
| Backblaze B2 | About $11 for 10,000 full plays of 5 minutes | Yes, single ranges ([b2-range]) | Own domain: unconfirmed | Egress charge above 3 times stored | [b2-pricing], [b2-range] |
| Bunny Storage with Bunny CDN | $0.01 per GB, $1 minimum | Unconfirmed | Unconfirmed | Not free after the 14-day trial | [bunny-cdn], [bunny-quickstart] |
| Vercel Blob | Free on Hobby to 10 GB, then $0.05 per GB | Unconfirmed | Unconfirmed | Hobby is non-commercial; list rate is the highest | [vercel-blob-pricing], [vercel-iad1] |
| GitHub Releases | $0, no cap stated | Yes (measured on a text file) | No | Served as an attachment, bandwidth clause | [gh-releases], [gh-release-measured] |

### The players

| Combination | What the visitor sees | What is lost compared with a streaming host | Licence and cost | Pixel events | Next.js effort | Moving later |
| --- | --- | --- | --- | --- | --- | --- |
| Video.js 10 over a plain MP4 (file on HighLevel or R2) | Your page, a poster and a play button. The Compat skin has "plain, unbranded surfaces". Centre play and seek buttons, full-screen, picture-in-picture, Cast and AirPlay, and a time bar with preview thumbnails once playing ([videojs-compat]). The default skin has a frosted modern look ([videojs-react-index]). No host logo | One quality. Start speed depends on faststart and range requests | Apache-2.0, free ([videojs-license]). Brightcove owns the "Video.js" trademark; Mux holds the "Corporate Shepherd" role ([videojs-site]) | Listen to the `<video>` events `play`, `timeupdate`, `ended` ([mdn-video]). The Video.js GA guide shows built-in progress milestones for Google Analytics, not for Meta ([videojs-ga]). Meta needs our code | `pnpm add @videojs/react@10.4.0`, then about ten lines ([videojs-react-install]). Markup renders on the server, playback works after hydration ([videojs-browsers]). Needs a client component (inferred). Supports Chrome 111, Safari and iOS Safari 16.4 and newer; the Compat skin goes lower ([videojs-browsers]) | Change the `src`. Video.js also has Mux, HLS and hls.js components ([videojs-react-index]), so a later move to Mux or HLS keeps the same skin |
| Media Chrome over a plain MP4 | Unbranded controls you arrange yourself as web components | One quality | MIT, free ([media-chrome-repo]). Mux publishes it | Same `<video>` events | More hand layout than a ready skin. Any media element works ([media-chrome-docs]) | The UI is separate from playback, so the playback part can change ([media-chrome-docs]) |
| Plain `<video>` with browser controls | The browser's own controls. They look different in Safari and Chrome. No logo | One quality. No custom look | None, built in | `<video>` events | Almost nothing: a tag with `controls`, `playsInline` and `poster`. `controlslist` can remove download and full-screen buttons ([mdn-video]) | Trivial: change the `src` |
| Plain `<video>` with our own controls | Exactly what we draw | One quality | None | `<video>` events | The most hand work: play, bar, time, full-screen, captions | Trivial to move the file, the controls stay ours |
| `next-video` (storage and player in one) | A Media Chrome player with the default theme "Sutro by Mux". Whether it shows a Mux logo: unconfirmed | One quality on non-Mux storage. "Web-compatible MP4 files" are required without Mux ([next-video-readme]) | MIT ([next-video-repo]). Free | `<video>` events | Built for Next.js. Providers: Mux (default), Vercel Blob, Backblaze, Amazon S3, Cloudflare R2. A `Player` component takes a remote `src` ([next-video-readme]) | Change the provider |
| Plyr or Vidstack | Clean, but both repositories now say they are deprecated in favour of Video.js 10 (Plyr: "security updates only"; Vidstack: "security fixes only until January 2028") ([plyr-repo], [vidstack-repo]) | One quality | MIT, free | `<video>` events | Not recommended for a new build | Move to Video.js 10 |
| Self-made HLS (an `ffmpeg` set of quality levels, served from R2, played by hls.js or Video.js) | A clean player. Adaptive, like Mux | Nothing lost on quality | hls.js is Apache-2.0 ([hlsjs-license]). Free | `<video>` events | High. Several encodes, many small files, caching and CORS settings. hls.js is 163 KB on the wire (measured) and Video.js has an `HlsJsVideo` and a native `NativeHlsVideo` ([videojs-react-index]). I did not read the `ffmpeg` HLS options, so the steps are unconfirmed | Standard HLS plays elsewhere |
| Mux plus Video.js 10 (the recommendation, for comparison) | The same Video.js skins over Mux's stream | Nothing lost. Adaptive | Video.js free, Mux per the cost tables | `<video>` events | The same ten lines, with `MuxVideo` as the source ([mux-vjs]) | Standard HLS address and a master download ([mux-master]) |
| Mux Player with a self-hosted source | Unconfirmed. Mux says Mux Player is only maintained and not for new players | Unconfirmed | Unconfirmed | Unconfirmed | Not recommended | Unconfirmed |

In plain words, one paragraph per combination:

**Video.js 10 over an MP4 on HighLevel or R2.** This is the main free route. The visitor sees your page. Video.js is free, open source and maintained. Its own site says v10 is stable ([videojs-readme]). Use the Compat skin for the plainest look, or the default skin for a modern one. You pay nothing, and nothing leads off the page. What you give up is adaptive quality.

**Media Chrome.** Controls built from small web parts. You get the cleanest result if you like to design the buttons, at the price of more work than a ready skin.

**Plain `<video>`.** The least code and nothing can break. The controls look like the visitor's phone, which is clean but not on-brand. It is a good first version if the owner wants the video live fast.

**`next-video`.** Easiest if you already want to use Mux (it is the default) or Vercel Blob. For other storage it needs a web-ready MP4 and gives one quality. It is a good wrapper, but Video.js alone does the same job with fewer layers.

**Plyr and Vidstack.** Skip them. Both point to Video.js 10 as their successor.

**Self-made HLS.** It gives a free adaptive stream, but you would make and host the quality levels yourself. Treat it as a later project if the plain MP4 shows stalls on weak phones. Mux does this for you and is free at this volume.

### The `ffmpeg` command for a phone-friendly 720p copy

`ffmpeg` is a free command-line video tool. One command makes a smaller file that starts fast. This command is built from FFmpeg's own documentation. I could not run `ffmpeg` here (it is not installed), so it has not been tested on the owner's file.

```
ffmpeg -i original.mp4 \
  -c:v libx264 -preset slow -crf 23 -maxrate 2500k -bufsize 5000k \
  -vf "scale=-2:720" -pix_fmt yuv420p -profile:v high \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  vsl-720p.mp4
```

What each part does:

| Part | Plain meaning | Source (read 2026-11-15) |
| --- | --- | --- |
| `-i original.mp4` | The file you start from. Use the largest version you have | Your own file |
| `-c:v libx264` | Make the picture in H.264, which every phone plays. `libx264` is FFmpeg's H.264 encoder | [ffmpeg-codecs] |
| `-preset slow` | Spend more time to get a smaller file at the same look. The x264 encoder's default is `medium` | [x264-src] |
| `-crf 23` | Constant quality. The scale runs 0 to 51, lower is better and larger, and 23 is x264's default | [x264-src], [x264-base] |
| `-maxrate 2500k -bufsize 5000k` | A ceiling of about 2.5 Mbps on the picture, so a loud scene cannot make the file too heavy for a phone. FFmpeg says `maxrate` needs `bufsize` set | [ffmpeg-codecs] |
| `-vf "scale=-2:720"` | Make the height 720 pixels. `-2` lets FFmpeg pick the width that keeps the shape and is an even number | [ffmpeg-filters] |
| `-pix_fmt yuv420p` | Use the colour layout phones and browsers expect. A standard FFmpeg option, and the compatibility reason is my inference | Inferred |
| `-profile:v high` | A common H.264 setting. That every current phone plays it is my inference. `profile` is an x264 option | [ffmpeg-codecs] |
| `-c:a aac -b:a 128k` | Make the sound in AAC (FFmpeg's built-in AAC encoder) at 128 kilobits a second | [ffmpeg-codecs] |
| `-movflags +faststart` | Move the index (the "moov atom") to the front so playback can start before the whole file arrives. FFmpeg describes it as "Run a second pass moving the index (moov atom) to the beginning of the file" | [ffmpeg-formats] |
| `vsl-720p.mp4` | The new file. Upload this one, not the original | Your own file |

Expected size (inferred): picture capped at 2.5 Mbps plus 128 kbps sound is at most about 2.63 Mbps, or at most about 59 MB for 3 minutes, 99 MB for 5 minutes and 197 MB for 10 minutes. The cost tables use a rounder 3 Mbps so they stay on the safe side. For a 1080p copy, change `720` to `1080` and `2500k` to `5000k` (and `bufsize` to `10000k`). A 1080p file is about double the size.

What `faststart` and range requests buy: the phone starts after the first slice arrives and the visitor can drag the bar ahead. What they do not buy: a drop in quality when the signal falls. A second 480p file at about 1 Mbps could be offered on slow connections, but how a page detects a slow connection is not something I confirmed. Treat it as a later idea.

### How play and progress reach Meta Pixel

A `<video>` element fires events: `play`, `timeupdate` (as the position moves) and `ended` ([mdn-video]). Meta Pixel takes your own event names through `fbq('trackCustom', name, params)`. The name must be a string up to 50 characters ([meta-custom]). This pattern is inferred from those two pages:

```ts
const sent = new Set<string>()
const send = (name: string) => {
  if (sent.has(name)) return
  sent.add(name)
  window.fbq?.('trackCustom', name, { video: 'event-vsl' })
}
video.addEventListener('play', () => send('VslPlay'))
video.addEventListener('timeupdate', () => {
  if (!video.duration) return
  const pct = (video.currentTime / video.duration) * 100
  for (const t of [25, 50, 75, 95]) if (pct >= t) send(`VslProgress${t}`)
})
video.addEventListener('ended', () => send('VslComplete'))
```

A visitor who drags the bar to the end would trigger every milestone at once. Count a milestone only while the video is playing steadily (inferred). Whether sending these events needs a consent gate is covered in "Cookies and consent" below.

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
| Bitrate of the phone-friendly web copy (added 2026-11-15) | 3 Mbps | The `ffmpeg` command in "Bring your own player" caps picture plus sound at about 2.63 Mbps, so 3 Mbps is a safe round number. The new plain MP4 rows use it. The older Vercel Blob and R2 rows keep 6.5 Mbps (the original 1080p file) |
| Gigabytes per minute | Mbps / 8 x 60 / 1000 | 6.5 Mbps is 0.04875 GB a minute. 3.33 Mbps is 0.02498 GB a minute. 3 Mbps is 0.0225 GB a minute |

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
| MP4 on Cloudflare R2 | Storage $0.015 per GB a month, 10 GB free, egress (data out to visitors) free. A 3 Mbps web copy (about 112 MB) also costs $0 | [cf-r2-pricing] |
| HighLevel Media Library (own player or its Hosted Video element) | $0 extra on the plan already paid. No storage or bandwidth cap is published. Plans listed at $97, $297 and $497 a month | [hl-pricing], [hl-tos] |
| MP4 on Backblaze B2, 3 Mbps web copy | First 10 GB stored free. Free egress up to 3 times the monthly average stored (assume only this file is stored), then $0.01 per GB | [b2-pricing], [b2-txn] |
| MP4 on Bunny Storage with Bunny CDN, 3 Mbps web copy | Delivery $0.01 per GB in Europe and North America, $1 minimum a month. The Storage product's own storage rate was not read: unconfirmed (under 2 cents for a 0.1 GB file at the Stream storage rate) | [bunny-cdn], [bunny-pricing-doc] |
| MP4 on Vercel Blob, 3 Mbps web copy | Same rates as the Vercel Blob row above. Hobby includes 1 GB stored and 10 GB transfer, then stops | [vercel-iad1], [vercel-blob-pricing] |
| MP4 on GitHub Releases | $0. No limit on release size or bandwidth is stated | [gh-releases] |
| Gumlet | Free: 60 minutes stored, 100 GB streaming bandwidth. Creator: $9 a month ($6 billed annually). Creator allows 3,000 GB and overage is $0.10 per GB (both from a search summary: approximate) | [gumlet-blog] |
| api.video | Pay as you go, "as low as": $0.0017 per minute delivered, $0.00285 per minute stored. Encoding free. Free sandbox is 30 seconds only | [apivideo-pricing] |

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
| HighLevel Media Library, own player | $0 extra | $0 extra | $0 extra | $0 extra | $0 extra | $0 extra |
| MP4 3 Mbps on Backblaze B2 | $1.12 | $11.25 | $56.25 | $0.45 | $4.50 | $22.50 |
| MP4 3 Mbps on Bunny Storage and CDN | $1.12 | $11.25 | $56.25 | $1 | $4.50 | $22.50 |
| MP4 3 Mbps on Vercel Blob (list rate) | $5.62 | $56.25 | $281.25 | $2.25 | $22.50 | $112.50 |
| MP4 on GitHub Releases | $0 | $0 | $0 | $0 | $0 | $0 |
| Gumlet | $9 (Creator) | $9 (Creator) | about $333 | $0 (Free) | $9 (Creator) | $9 (Creator) |
| api.video | $8.51 | $85.01 | $425.01 | $3.41 | $34.01 | $170.01 |

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
| HighLevel Media Library, own player | $0 extra | $0 extra | $0 extra | $0 extra | $0 extra | $0 extra |
| MP4 3 Mbps on Backblaze B2 | $0.67 | $6.75 | $33.75 | $0.27 | $2.70 | $13.50 |
| MP4 3 Mbps on Bunny Storage and CDN | $1 | $6.75 | $33.75 | $1 | $2.70 | $13.50 |
| MP4 3 Mbps on Vercel Blob (list rate) | $3.38 | $33.75 | $168.75 | $1.35 | $13.50 | $67.50 |
| MP4 on GitHub Releases | $0 | $0 | $0 | $0 | $0 | $0 |
| Gumlet | $0 (Free) | $9 (Creator) | about $84 | $0 (Free) | $9 (Creator) | $9 (Creator) |
| api.video | $5.11 | $51.01 | $255.01 | $2.05 | $20.41 | $102.01 |

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
| HighLevel Media Library, own player | $0 extra | $0 extra | $0 extra | $0 extra | $0 extra | $0 extra |
| MP4 3 Mbps on Backblaze B2 | $2.24 | $22.49 | $112.49 | $0.89 | $8.99 | $44.99 |
| MP4 3 Mbps on Bunny Storage and CDN | $2.25 | $22.50 | $112.50 | $1 | $9 | $45 |
| MP4 3 Mbps on Vercel Blob (list rate) | $11.25 | $112.50 | $562.50 | $4.50 | $45 | $225 |
| MP4 on GitHub Releases | $0 | $0 | $0 | $0 | $0 | $0 |
| Gumlet | $9 (Creator) | $9 (Creator) | about $958 | $0 (Free, at the cap) | $9 (Creator) | about $209 |
| api.video | $17.03 | $170.03 | $850.03 | $6.83 | $68.03 | $340.03 |

### Free caps, in plays (added 2026-11-15)

Options whose free cap runs out quickly are not in the cost rows above. This table shows how many plays a month each free cap covers before it runs out. Compare the numbers with the 1,000, 10,000 and 50,000 plays cases. A figure below 1,000 means the free option fails even the smallest case. Plain MP4 caps use the 3 Mbps web copy (0.0225 GB a minute). Gumlet, Wistia and Vimeo use the 3.33 Mbps adaptive assumption. Figures are rounded down.

| Free cap | 3 min, full | 3 min, 40% | 5 min, full | 5 min, 40% | 10 min, full | 10 min, 40% | Source (read 2026-11-15) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Vercel Blob Hobby, 10 GB transfer a month | 148 | 370 | 88 | 222 | 44 | 111 | [vercel-blob-pricing] |
| Supabase Free, 10 GB egress a month (and the file must be under 50 MB) | 148 | 370 | 88 | 222 | 44 | 111 | [supabase-limits], [supabase-egress] |
| Uploadcare Free, 5 GB traffic a month | 74 | 185 | 44 | 111 | 22 | 55 | [uploadcare-pricing] |
| ImageKit Free, 20 GB bandwidth a month | 296 | 740 | 177 | 444 | 88 | 222 | [imagekit-plans] |
| Cloudinary Free, 25 credits if all go to 1 GB each (inferred) | 370 | 925 | 222 | 555 | 111 | 277 | [cloudinary-plans] |
| Dropbox Basic, 20 GB a day (per day, not per month) | 296 | 740 | 177 | 444 | 88 | 222 | [dropbox-banned] |
| Dropbox Plus and higher, 1 TB a day (per day) | 14,814 | 37,037 | 8,888 | 22,222 | 4,444 | 11,111 | [dropbox-banned] |
| Backblaze B2, free egress of 3 times the stored file | 3 | 7 | 3 | 7 | 3 | 7 | [b2-pricing] |
| Gumlet Free, 100 GB a month | 1,334 | 3,336 | 800 | 2,002 | 400 | 1,001 | [gumlet-blog] |
| Wistia Free, 200 GB a month | 2,669 | 6,673 | 1,601 | 4,004 | 800 | 2,002 | [wistia-usage] |
| Vimeo Free, 1 TB a month (but the policy issue stands) | 13,346 | 33,366 | 8,008 | 20,020 | 4,004 | 10,010 | [vimeo-2026] |
| Mux, 100,000 free minutes a month | 33,333 | 83,333 | 20,000 | 50,000 | 10,000 | 25,000 | [mux-pricing] |
| Cloudflare R2, free egress | No cap | No cap | No cap | No cap | No cap | No cap | [cf-r2-pricing] |
| HighLevel Media Library | No published cap | No published cap | No published cap | No published cap | No published cap | No published cap | [hl-pricing] |
| GitHub Releases | No cap stated | No cap stated | No cap stated | No cap stated | No cap stated | No cap stated | [gh-releases] |
| Loom Starter | Not stated | Not stated | Not stated | Not stated | Not stated | Not stated | [loom-pricing] |

How to read the tables, and what each line leaves out:

- **Mux:** minutes delivered minus 100,000 free, times $0.0008 (the 720p rate; at the 1080p rate of $0.001 the paid cases cost 25 percent more), minus the $20 pay-as-you-go credit, never below zero. Storage adds about $0.015 a month for 5 minutes at 1080p. One-time plus-quality input adds about $0.16 for 5 minutes at 1080p. Basic quality has free input but a lower target video quality ([mux-pricing]). The Free plan has the same 100,000 free minutes but a 10 video storage limit ([mux-plan-page]); what happens past 100,000 minutes on the Free plan is unconfirmed, so the paid cases assume pay as you go.
- **Cloudflare Stream:** $5 (the smallest storage block, 1,000 minutes) plus $1 per 1,000 minutes delivered. Delivery rounds to 4 second pieces ([cf-pricing]).
- **Bunny Stream:** GB at 3.33 Mbps times $0.01, never below the $1 monthly minimum. Storage of the encoded copies adds a few cents. All numbers assume a visitor in Europe or North America. A visitor elsewhere costs 3 to 6 times more per GB ([bunny-cdn]).
- **Vimeo, individual plan:** the smallest individual plan whose managed bandwidth cap covers the GB (Creator 1 TB a month, Core 2 TB a month). Vimeo's embeddable videos count as managed ([vimeo-managed]). Creator is the cheapest plan that allows hiding the controls ([vimeo-params]). Studio is capped at 36 TB a year ([vimeo-2026]), so a short campaign fits.
- **Wistia, Free or Business:** Free if 200 GB or less (it stops playing when the limit is hit, and keeps the Wistia logo), otherwise Business at $79 plus bandwidth added in advance. The overage rate per GB on Business was not found: unconfirmed. Wistia delivers a smaller "smart encoded" version at typical embed sizes ([wistia-usage]), so Wistia's real GB may be lower than the 3.33 Mbps assumption.
- **MP4 on Vercel Blob:** GB at 6.5 Mbps times $0.05. Pro may cover the first 1 TB of data transfer through its flat-rate CDN tier, which could lower the bill by up to $50 ([vercel-blob-pricing]; unconfirmed whether Blob Data Transfer is covered by it). Add $20 a month for the Pro plan if the site is not on Pro already. Hobby is limited to personal or non-commercial use ([vercel-terms]). Browsers fetch plain MP4 files in ranges and may download more than a visitor watches (inferred).
- **MP4 on R2:** one GB-sized file stays under the free 10 GB storage, and the request counts stay under the free tier (inferred: 50,000 plays at 10 requests each is 500,000, below 10 million free Class B requests, [cf-r2-pricing]). Egress is free. A custom domain is needed for a production address, since the `r2.dev` address is for non-production use ([cf-r2-public]). Cloudflare says the domain must be a zone in the same Cloudflare account, and that a domain managed elsewhere uses a partial (CNAME) setup ([cf-r2-public]); which Cloudflare plan a partial setup needs is unconfirmed. The 3 Mbps web copy (about 112 MB for 5 minutes) also stays under the free 10 GB, so it costs $0.
- **HighLevel Media Library:** $0 extra. No storage or bandwidth cap is published, and plans marketed as "unlimited" fall under a Fair Use Policy ([hl-pricing], [hl-tos]). Its native Hosted Video element makes quality levels on request ([hl-hosted-video]), but it runs only inside HighLevel pages, so the cost row is for storing the file and playing it with our own player.
- **MP4 on Backblaze B2:** GB at 3 Mbps, minus 3 times the stored size of the file (a few hundred MB, so it hardly matters), times $0.01. The free egress rule counts the monthly average stored, and I assumed only this file is stored ([b2-pricing]).
- **MP4 on Bunny Storage with CDN:** GB at 3 Mbps times $0.01, never below the $1 monthly minimum, for a visitor in Europe or North America. A trial gives $20 of credit for 14 days ([bunny-quickstart]).
- **MP4 on Vercel Blob, 3 Mbps copy:** GB times $0.05 at the list rate. Hobby covers 10 GB then stops (see the free-cap table). The Pro plan's $20 credit is not subtracted.
- **MP4 on GitHub Releases:** $0 because no bandwidth limit is stated. GitHub may throttle "significantly excessive" use ([gh-aup]). Not recommended.
- **Gumlet:** GB at 3.33 Mbps. Free if 100 GB or less, otherwise Creator at $9 a month (monthly billing). Above 3,000 GB, overage is $0.10 per GB, a figure from a search summary, so the paid cases are approximate. Whether the logo is removed on Creator: unconfirmed.
- **api.video:** minutes delivered times $0.0017 plus the stored minutes times $0.00285 for the one month. Both rates are "as low as", so higher tiers would cost the same or more. Mux costs less at every case in the tables.

## Sources and how they are cited

Every citation is a link label in square brackets. The full address of each label is listed at the end of this memo. Read dates are 2026-11-15 for all of them.

- **Docs** means the vendor's own help center, developer docs or API reference. Examples: YouTube's player parameters page ([yt-params]), Vimeo's help center ([vimeo-params]), Wistia's developer docs ([wistia-attrs]), Mux's `llms.txt` and Markdown docs ([mux-vjs]), Cloudflare's docs read as Markdown ([cf-player]), Bunny's docs read as Markdown ([bunny-embed]), Vercel's docs read as Markdown ([vercel-blob-pricing]).
- **Pricing pages** are cited next to each price, with the date in the sentence or table.
- **Terms and policy** pages: Vimeo's Plan Usage Policy ([vimeo-policy]), Vercel's Terms of Service ([vercel-terms]), Cloudflare's service terms ([cf-terms]), and the YouTube developer policies ([yt-devpol]).
- **Browser behaviour** comes from MDN ([mdn-autoplay], [mdn-video]) and WebKit's own blog ([webkit-video]).
- **Law:** the Video Privacy Protection Act text at [vppa].
- **Measured by me:** the size on the wire of some public player scripts, fetched with `curl` on 2026-11-15, no account used. These are marked "measured". They cover the script, not the player inside an iframe.
- **Measured headers (added 2026-11-15):** read-only `curl` requests to two public files, no login, nothing uploaded: a HEAD request and a `Range: bytes=0-1` request to the HighLevel file, and a `Range: bytes=0-1` request to the GitHub file. The files were a public image from a HighLevel Ideas post ([hl-measured]) and a text file attached to a public project release on GitHub ([gh-release-measured]). The results were read from response headers only.
- **HighLevel docs (added 2026-11-15):** HighLevel's help center ([hl-limits], [hl-hosted-video]), its API docs ([hl-api-upload]), its Terms of Service ([hl-tos]) and its pricing page ([hl-pricing]). The Ideas board and changelog ([hl-domain-idea], [hl-lazy]) are user requests and release notes. I used them to find public addresses and to see HighLevel's status changes, not as proof that a feature works. The old help-desk page ([hl-import]) is on HighLevel's own help domain.
- **Open-source players (added 2026-11-15):** licence and deprecation notes come from each project's public repository record ([plyr-repo], [vidstack-repo], [media-chrome-repo], [next-video-repo], [hlsjs-license], [videojs-license]) and docs ([videojs-react-install], [media-chrome-docs]).
- **FFmpeg (added 2026-11-15):** FFmpeg's own documentation ([ffmpeg-formats], [ffmpeg-codecs], [ffmpeg-filters]) and the x264 encoder source for the quality scale and default ([x264-src], [x264-base]). FFmpeg's Trac H.264 guide was blocked to my tools.
- A few help pages were seen only through a search summary and not opened. These are marked "(search summary)". Added 2026-11-15: Streamable's pricing ([streamable-pricing], the page did not load), Cloudinary's file size limit ([cloudinary-size], blocked), Supabase's egress and storage quota ([supabase-egress]), Gumlet's Creator bandwidth and overage rate (seen through a search summary of [gumlet-blog]) and the Internet Archive's rights page ([ia-rights]; its terms page [ia-terms] did not load). The first-version list: YouTube audience retention ([yt-ret]), YouTube download ([yt-dl]), Vimeo downloads ([vimeo-dl]), Vimeo adaptive streaming ([vimeo-adaptive]), Vimeo analytics terms ([vimeo-analytics]), Wistia branding ([wistia-branding]), Wistia exports ([wistia-export]) and Wistia media delivery ([wistia-delivery]).
- "Inferred" marks my own reasoning from the sources. "Unconfirmed" marks something I could not establish from a primary source. The last section collects them.

No account was created, nothing was uploaded and no payment details were entered. No review sites or comparison blogs were used as evidence. Search results were used only to find the vendor's own pages.

## Comparison tables

The same rows appear in all three tables. The first eight are the original options. The rows from "MP4 on HighLevel media" down were added on 2026-11-15, and where a cell says "unconfirmed" I could not establish it from a primary source. Words in a cell are explained in the option sections below. **Adaptive bitrate** means the host makes several quality levels of the video, and the player switches between them as the connection changes, so a weak signal gets a lower quality instead of a stalled picture. **HLS** and **DASH** are the two common ways of doing that. **Egress** means data sent out to visitors.

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
| MP4 on HighLevel media, own player | $0 extra. No cap published, Fair Use Policy applies ([hl-pricing], [hl-tos]) | One quality only: raw videos "can only play in one quality" ([hl-hosted-video]). Range requests answered on a test image (measured) | No script. The same `<video>` tag. Cache header of one year on the test file (measured) |
| HighLevel Hosted Video element | $0 extra, on pages built in HighLevel only | Adaptive quality choice of 480P, 720P, 1080P and Auto after encoding ([hl-hosted-video]). Whether it is HLS: unconfirmed | Player libraries load only on play or autoplay ([hl-lazy]). Size: unconfirmed |
| MP4 on Backblaze B2 | First 10 GB stored free, free egress up to 3 times stored, then $0.01 per GB ([b2-pricing]). About $11 for 10,000 full plays of 5 minutes | One quality only. Range requests documented ([b2-range]) | No script. The same `<video>` tag |
| MP4 on Bunny Storage with CDN | $0.01 per GB, $1 minimum. Trial only, no free tier ([bunny-quickstart], [bunny-cdn]) | One quality only. Range support: unconfirmed | No script. The same `<video>` tag |
| MP4 on GitHub Releases | $0, no bandwidth cap stated ([gh-releases]) | One quality only. Range requests answered (measured on a text file) | No script. Served as an attachment (measured) |
| Gumlet | Free to 100 GB a month, Creator $9 monthly ([gumlet-blog]) | Adaptive bitrate: unconfirmed | Unconfirmed |
| api.video | Free sandbox is 30 seconds only. Pay as you go from $0.0017 a minute delivered ([apivideo-pricing]) | Unconfirmed | Unconfirmed |
| Loom Starter | Free: 25 videos, 5 minutes each ([loom-pricing]) | Unconfirmed | Unconfirmed. An iframe |
| Streamable | Free with ads, 250 MB and 10 minutes, 90 day deletion (search summary, [streamable-pricing]) | Unconfirmed | Unconfirmed |
| Google Drive | $0. A "too many users" block lasts about 24 hours ([drive-limit]) | Unconfirmed | Unconfirmed |
| Dropbox | $0 within daily link limits of 20 GB (Basic) to 4 TB ([dropbox-banned]) | One quality only (inferred: a file link) | Unconfirmed |
| ImageKit | Free to 20 GB a month, 100 MB largest video ([imagekit-plans]) | Unconfirmed | Unconfirmed |
| Cloudinary | Free credits, 100 MB largest video (search summary, [cloudinary-plans], [cloudinary-size]) | Unconfirmed | Unconfirmed |
| Uploadcare | Free to 5 GB a month, 500 MB largest file ([uploadcare-pricing]) | Adaptive bitrate streaming is listed on Free ([uploadcare-pricing]) | Unconfirmed |
| Supabase Storage | Free to about 10 GB a month and 50 MB per file ([supabase-limits], [supabase-egress]) | One quality only | No script. The same `<video>` tag |
| Internet Archive | $0, terms unconfirmed ([ia-terms]) | Unconfirmed | Unconfirmed |
| Cloudflare Pages assets | Free, but not applicable: 25 MiB per file cannot hold the video ([cf-pages-limits]) | Not applicable: file cannot be stored | Not applicable: file cannot be stored |
| GitHub Pages | $0 to 100 GB a month (soft limit), but its terms bar running an online business or commercial transactions from it ([gh-pages-limits]) | One quality only (inferred: a plain file) | No script. A repository blocks files over 100 MiB ([github-large]) |

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
| MP4 on HighLevel media, own player | Nothing but your page. The video address is on a HighLevel host (`filesafe.space`) that some firewalls block ([hl-domain-idea]) | Whatever player we build. Clean choices: Video.js 10 Compat skin, Media Chrome, plain `<video>` | None from the host. HighLevel's own video tracking works only with its Hosted Video element ([hl-hosted-video]) |
| HighLevel Hosted Video element | Not documented: logo and branding unconfirmed ([hl-hosted-video]) | Muted autoplay by browser rules, play and pause, speed 0.5x to 2x, pending time, full-screen, progress bar and seeking can be hidden. Custom poster: unconfirmed ([hl-hosted-video]) | A video tracking trigger exists for workflows (title seen, not read: [hl-tracking-trigger]). Percent watched in reports: unconfirmed |
| MP4 on Backblaze B2 | Nothing but your page | The same as the other plain MP4 | None from the host |
| MP4 on Bunny Storage with CDN | Nothing but your page | The same as the other plain MP4 | None from the host |
| MP4 on GitHub Releases | Nothing but your page | The same as the other plain MP4 | None from the host |
| Gumlet | Gumlet logo stays on Free ([gumlet-blog]). Suggested videos: unconfirmed | Unconfirmed | Unconfirmed |
| api.video | Free sandbox videos carry the api.video logo, paid accounts can add their own logo ([apivideo-pricing]). Suggested videos: unconfirmed | Player "can be customized to match your branding" ([apivideo-pricing]). Muted autoplay and poster: unconfirmed | Analytics retention is a paid add-on from $12 a month ([apivideo-pricing]) |
| Loom Starter | Loom branding stays: removal is listed only for Business ([loom-pricing]). Suggested videos: unconfirmed | Unconfirmed | Unconfirmed |
| Streamable | Ads appear next to videos on the free plan (search summary, [streamable-pricing]) | Unconfirmed | Unconfirmed |
| Google Drive | The Drive viewer: unconfirmed | Unconfirmed | None from the host (inferred) |
| Dropbox | The Dropbox viewer or the raw file: unconfirmed | Unconfirmed | None from the host (inferred) |
| ImageKit | Unconfirmed | Unconfirmed | Unconfirmed |
| Cloudinary | Unconfirmed | Unconfirmed | Unconfirmed |
| Uploadcare | Unconfirmed | Unconfirmed | Unconfirmed |
| Supabase Storage | Nothing but your page | The same as the other plain MP4 | None from the host |
| Internet Archive | Unconfirmed | Unconfirmed | Unconfirmed |
| Cloudflare Pages assets | Not applicable: file cannot be stored ([cf-pages-limits]) | Not applicable: file cannot be stored | Not applicable: file cannot be stored |
| GitHub Pages | Nothing but your page | The same as the other plain MP4 | None from the host |

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
| MP4 on HighLevel media, own player | `<video>` events `play`, `timeupdate`, `ended` ([mdn-video]) | `<video>` tag, Video.js 10 ([videojs-react-install]) or Media Chrome | The file is yours. The address belongs to HighLevel's host and cannot be moved to our domain ([hl-domain-idea]). Keep the original: files can be deleted 90 days after the account ends ([hl-tos]) | The one response I checked set a Cloudflare `__cf_bm` cookie on `filesafe.space` (measured, purpose inferred) |
| HighLevel Hosted Video element | Not readable from our page: the player is configured inside HighLevel pages (inferred). Workflow tracking only | No Next.js path documented: unconfirmed | Tied to HighLevel pages (inferred) | Unconfirmed |
| MP4 on Backblaze B2 | The same | The same | The file is yours. The address is on a Backblaze host unless a domain is set up: unconfirmed | None from a file. Response cookies: unconfirmed |
| MP4 on Bunny Storage with CDN | The same | The same | The file is yours. Own-domain address: unconfirmed | None from a file. Response cookies: unconfirmed |
| MP4 on GitHub Releases | The same | The same | The file is yours. The address redirects to a signed, short-lived address (measured) | None from a file. Response cookies: unconfirmed |
| Gumlet | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| api.video | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| Loom Starter | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| Streamable | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| Google Drive | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| Dropbox | `<video>` events if the raw file is used (inferred) | `<video>` tag | The file is yours. The link can pause for 24 hours ([dropbox-banned]) | Unconfirmed |
| ImageKit | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| Cloudinary | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| Uploadcare | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| Supabase Storage | The same | The same | The file is yours. A bucket address on a Supabase host: unconfirmed | None from a file. Response cookies: unconfirmed |
| Internet Archive | Unconfirmed | Unconfirmed | Unconfirmed | Unconfirmed |
| Cloudflare Pages assets | Not applicable: file cannot be stored | Not applicable: file cannot be stored | Not applicable: file cannot be stored | Not applicable: file cannot be stored |
| GitHub Pages | The same | The same | The file is yours. The address is a github.io host unless a domain is set up: unconfirmed | None from a file. Response cookies: unconfirmed |

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

**What you give up.** Work. There is no point-and-click dashboard of "who watched how much" like Wistia's; viewers' watching shows up in Mux Data, and the Meta events come from code in the page. The new Video.js 10 packages are recent. Video.js's own README says v10 "is stable" ([videojs-readme]); real-world stability is untested. If the iframe player (`player.mux.com`) is used instead, whether it lets the page read play events is unconfirmed.

**What it costs.** $0 for the first 100,000 minutes delivered each month. Pay as you go adds a $20 monthly credit. Delivery is $0.0008 a minute up to 720p and $0.001 at 1080p. Storage is $0.003 per minute a month at 1080p, and a new video sits in a cheaper "cold" tier until someone first plays it ([mux-pricing]). The Free plan stores only 10 videos and does no live ([mux-plan-page]), so later Event Pages should use pay as you go. Mux's pricing page says "No credit card to start" ([mux-plan-page]); whether pay as you go needs a card: unconfirmed.

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
| MP4 (Vercel Blob, repository or R2) | No. Served as is | Directly sets what visitors download, and the GB bill | Upload a smaller web version, about 3 Mbps for 720p. The `ffmpeg` command in "Bring your own player" makes it |
| MP4 on HighLevel, Backblaze B2, Bunny Storage, GitHub Releases or Supabase | No. Served as uploaded (HighLevel: raw videos "can only play in one quality", [hl-hosted-video]) | Directly sets what visitors download. HighLevel allows 4 GB per video ([hl-limits]), Supabase Free only 50 MB ([supabase-limits]), GitHub Releases 2 GiB ([gh-releases]) | Upload the 720p web copy from the `ffmpeg` command, not the original |
| HighLevel Hosted Video element | Yes: it encodes 480P, 720P, 1080P and Auto after you start encoding ([hl-hosted-video]) | Raw videos "can only play in one quality" until encoded | Upload the largest, up to 4 GB. Only usable on HighLevel pages |
| Gumlet, api.video | api.video: yes, encoding is free ([apivideo-pricing]). Gumlet: unconfirmed | api.video bills by minutes. Gumlet Free stores 60 minutes ([gumlet-blog]) | Upload the largest |
| Loom, Streamable, Cloudinary, ImageKit, Uploadcare, Google Drive, Dropbox | Unconfirmed | Caps on file size: Streamable 250 MB, Cloudinary and ImageKit Free 100 MB, Uploadcare 500 MB ([streamable-pricing], [cloudinary-size], [imagekit-plans], [uploadcare-pricing]) | Not worth uploading to: see "Free options" |

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
| HighLevel, Backblaze, GitHub, Gumlet, api.video, Loom, Streamable, Google Drive, Dropbox, ImageKit, Cloudinary, Uploadcare, Supabase, Internet Archive (added 2026-11-15) | Not looked up. No nonprofit offer appeared on the pages read for these, and no separate search was made. None is needed for the free tiers | The pages listed in "Free options" |

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
| hls.js 1.6.15 `hls.min.js` (added 2026-11-15) | 163 KB | Plays HLS in browsers that lack native HLS. Only needed for self-made or Mux HLS streams, not for a plain MP4 ([hlsjs-measured]) |
| Video.js 8.23.4 `video.min.js` (added 2026-11-15) | 200 KB | The older Video.js 8, for contrast. Video.js 10 is a rewrite ([videojs8-measured]) |
| Plyr 3.7.8 `plyr.min.js` (added 2026-11-15) | 33 KB | Deprecated in favour of Video.js 10, shown for contrast ([plyr-measured]) |
| Video.js 10 (added 2026-11-15) | Not measured by me. Video.js's own site gives 51 kB against 164 kB for Video.js 8 in a slow 4G test | A vendor figure, not mine ([videojs-site]). A plain `<video>` tag adds no script |

What this means: the video is near the top of an Event Page, so lazy-loading an iframe saves little. The cheaper pattern on every host is a **facade**: show the poster image and a play button, and create the player only when the visitor taps. That matches the muted autoplay rules, because a tap is a user gesture. Whether a tap-then-create-iframe flow starts playback on iOS without a second tap is unconfirmed for each host and needs a phone test. On the plain MP4 options, `preload="none"` with a `poster` already is a facade ([mdn-video]).

## Recommendation and runner-up

The weights for this revision: a clean player first (no host logo, no suggested videos, no links leading away, minimal chrome), then a free or near-free cost, then a good result on a weak phone signal.

### Recommendation: Mux, in a clean Video.js 10 player (unchanged)

**Why.** It meets all three weights at this volume. The page controls the player and the docs read show no host logo or suggested videos ([mux-vjs]). The first 100,000 minutes delivered each month are free, which covers the NYE event at 10,000 plays of a 5 minute video watched fully (50,000 minutes) with half to spare ([mux-pricing]). Quality adapts to a phone's signal ([mux-pricing]). Pay as you go means no yearly commitment, and the pricing page says no credit card is needed to start ([mux-plan-page]). The video can be downloaded back out as a master file ([mux-master]), and the stream is standard HLS ([mux-vjs]). Nonprofit credits are on offer ([mux-pricing]). There is a React path in `next-video` ([next-video-npm]) and in Video.js 10 ([videojs-react-install]).

**What choosing it means.**
- Someone builds a small player component, a poster, and the Meta Pixel events (`play`, and percent watched from media events). There is no no-code embed with a stats dashboard.
- Viewing stats live in Mux Data, which is built for playback quality; a dashboard of "plays by percent watched" is unconfirmed. For Meta, our own events are the source of truth.
- The Free plan stores 10 videos. Plan on pay as you go once Event Pages multiply. Whether pay as you go needs a card on file: unconfirmed.
- Mux Player (the older component) is only maintained. Use Video.js 10 or `next-video`. Video.js's own README says v10 "is stable" ([videojs-readme]); test it before launch all the same.
- Cost risk is low: 50,000 full plays of a 5 minute video is about $100 a month ([mux-pricing], read 2026-11-15), and a paid month can be switched off.

### Runner-up (changed): your own 720p MP4 in a Video.js 10 player, stored in HighLevel or Cloudflare R2

**Why.** It is the best free and clean option I found. It costs $0 extra at any volume in the cost tables, adds no host logo or links to the page, needs no new vendor if the file stays in HighLevel, and keeps the same Video.js skin if the owner later moves to Mux ([videojs-react-index]). The players are open source: Video.js is Apache-2.0 ([videojs-license]).

**What choosing it means.**
- One quality only. A visitor whose signal falls below about 2.6 Mbps sees pauses (inferred). Faststart and range requests help it start quickly and let the visitor skip, but they do not add adaptive quality.
- The owner runs one `ffmpeg` command to make the 720p file. The command is in "Bring your own player" and has not been tested on the real file.
- Stats are ours only. Meta events come from the `<video>` element ([mdn-video]).
- If the file lives in HighLevel: no cap is published but a Fair Use Policy applies, the address is not on our domain, the file can be deleted 90 days after the account ends, and I measured range support on an image, not a video ([hl-tos], [hl-measured]). Run the ten minute phone test first.
- If the file lives in R2: free, egress is free, and a custom domain that is a Cloudflare zone is needed for a production address ([cf-r2-public]). Whether R2 answers range requests is unconfirmed.
- Plan the move: this runner-up can be the launch version, and Mux the upgrade if the data show visitors stalling on weak signals.

### Also viable, and why not first

- **Wistia, Business plan (the first version's runner-up).** It is the better fit if the owner wants a finished marketing tool with per-viewer data, heatmaps, a logo-free player and a React component, and does not want to build the player. Events for Meta can still be read in the page ([wistia-events]). A nonprofit discount exists ([wistia-billing]). Its costs: $79 a month billed annually ([wistia-pricing], read 2026-11-15), which is $948 for a year, before any nonprofit discount (size unconfirmed); the monthly price was not read. A cap of 1 TB a month, so a 5 minute video at 10,000 full plays (about 1.25 TB at my assumption) already needs an add-on ($150 a month for +1 TB) ([wistia-usage]). Wistia's own Meta integration needs the Signals add-on, which makes the plan $329 a month billed annually ([wistia-meta], [wistia-pricing]); our own events work without it. Viewer data tied to an email address (`email`) goes to a third party, and Privacy Mode makes viewers anonymous and breaks that link ([wistia-privacy-docs]). It moved down because the free plan keeps the Wistia logo ([wistia-pricing]).
- **Bunny Stream** is the cheapest per play after 100,000 minutes (about $62 for 50,000 full plays of 5 minutes, [bunny-pricing-doc], read 2026-11-15). It is a close third. It was not chosen because its cookie behavior and several controls are undocumented where I looked and the free quota of Mux is better at this volume. It has no free tier, only a 14-day trial ([bunny-quickstart]).
- **YouTube** is the fastest and cheapest start, and the one to use if launch day comes first. Its cost is a sales page with the YouTube brand and links on it.
- **Vimeo** is not recommended for a nonprofit unless the owner is willing to pay for Studio, or accept the risk of an individual plan.
- **Cloudflare Stream** is a good second to Mux if the owner wants one flat, easy-to-predict bill ($5 plus $1 per 1,000 minutes, [cf-pricing], read 2026-11-15) and does not need a stats dashboard.
- **Gumlet** has a free plan (100 GB a month, 60 minutes stored) but keeps the Gumlet logo on Free ([gumlet-blog]). A paid plan costs more than Mux at every volume in the tables.
- **Plain MP4 on paid storage** (Vercel Blob, Backblaze B2, Bunny Storage) should only be a fallback, and a smaller web file. Cloudflare R2 and HighLevel are the free versions of the same idea.
- **Not recommended:** GitHub Releases or Pages (terms and delivery headers), Google Drive and Dropbox (daily and "too many users" limits), Loom and Streamable (branding and ads), api.video (free sandbox is 30 seconds and watermarked), and the small-cap image services (ImageKit, Cloudinary, Uploadcare, Supabase).

## Cookies and consent for a US 501(c)(3) running Meta ads

This is a summary of what the hosts document. It is not legal advice, and I did not research Meta's Pixel itself, which is the larger tracking question on the page.

- **Hosts that set tracking by default.** YouTube's normal embed and Vimeo without `dnt=1` set cookies that identify the viewer to the host ([vimeo-cookies], [yt-embed-help]). `youtube-nocookie.com` limits personalization; whether it sets cookies before play is unconfirmed ([yt-embed-help]).
- **Hosts that document no tracking cookies.** Wistia since 2020 ([wistia-privacy-help]). Mux sets a first-party cookie through Mux Data unless turned off ([mux-privacy]). Cloudflare Stream and Bunny: not documented.
- **Where a consent banner would matter (inferred).** If any visitors may come from the EU or UK, a tracking embed such as standard YouTube should be blocked until a banner choice. In the US a federal rule requiring a banner was not found in this research. Some state privacy laws reach nonprofits and some do not; which apply to OHP is unconfirmed. If a banner is used for the Meta Pixel, put the video player behind the same gate unless the host sets no tracking.
- **The Video Privacy Protection Act.** The federal law makes a video service provider liable for knowingly disclosing personally identifiable information about a person who requested specific video materials ([vppa]). Mux's privacy page says Mux Data complies with it ([mux-privacy]). Whether a nonprofit's sales video, with titles sent to Meta alongside an identity, falls under it is unconfirmed and a question for counsel before the play events are sent to Meta.
- **HighLevel storage and other new options (added 2026-11-15).** The one HighLevel media response I checked set a Cloudflare `__cf_bm` cookie on `filesafe.space` (measured; purpose inferred). That is a cookie from a host the visitor never chose, so a consent gate that covers the Meta Pixel should cover the video address too if the file stays in HighLevel. R2, B2, Bunny, Supabase and GitHub Releases: response cookies not checked. Cookies from Gumlet's and Loom's players: unconfirmed.
- **Meta events from the page.** With a host that sets no cookie and a page that sends `fbq` events only after consent, the video host adds little privacy exposure. The exposure is in what the page sends.

## Unconfirmed

What is still unconfirmed after the 2026-11-15 revision.

**Carried over from the first version**
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
- Mux: whether Mux Data's dashboard shows percent watched and per-viewer data, whether the Free plan includes Mux Data, what happens on the Free plan beyond 100,000 minutes, whether the `player.mux.com` iframe exposes play events, the nonprofit credit amount, and whether pay as you go needs a card (the pricing page says none is needed "to start").
- Cloudflare Stream: cookies set by the player, whether any Cloudflare logo shows, how a plays count can be had, whether OHP is eligible for the Cloudflare for Startups nonprofit credits now.
- Bunny Stream: cookies set by the player, a way to hide all controls on one embed, a custom poster option, and any nonprofit program.
- YouTube: when cookies are set with `youtube-nocookie.com`, how embedded views show in Studio reports, a `mute` URL parameter (not on the parameters page), custom thumbnail steps, and whether `YouTubeEmbed` gives access to the player API.
- Vercel: which plan OHP is on and whether Blob data transfer falls under the Pro flat-rate tier, and whether a Blob address can sit on a custom domain.
- Which US state privacy laws apply to OHP, and whether the VPPA applies to the page.

**HighLevel (new)**
- Whether a video file, not just an image, is served with range requests, CORS and the same headers. I found no public HighLevel video to test.
- Whether iOS Safari and Android Chrome play a HighLevel-hosted MP4 in a plain `<video>`. The ten minute phone test answers it.
- Which address the Media Library's copy-link button gives (`filesafe.space` or `storage.googleapis.com`).
- The real video upload limit in the Media Library: 4 GB (limits article) against an example error saying 50 MB (file types article). Through the API: 25 MB and 500 MB are documented, and a request to raise 25 MB shows as complete with no new number.
- The storage and bandwidth allowance per plan, and where Fair Use begins. Which plan the owner holds.
- What the Hosted Video player looks like (logo, branding, skin), where its encoded copies live, and whether it can be embedded outside HighLevel.
- Whether HighLevel is content for a marketing page to play files from its storage at ad-traffic volume.

**Free options and players (new)**
- Cloudflare R2: whether a free account can enable it without a card, whether R2 answers range requests, and whether a custom domain needs a paid Cloudflare plan when DNS is elsewhere (the docs say a "partial (CNAME) setup" exists but do not name the plan).
- Whether Cloudflare's CDN rule for video applies to R2 files on a free account. The rule names paid services such as the Developer Platform ([cf-terms]); that R2 counts is my inference.
- Backblaze B2: whether a card is needed for the free 10 GB, whether the egress allowance counts the free storage, whether an own-domain address is easy.
- GitHub Releases: whether phones play a video sent as `application/octet-stream` with `content-disposition: attachment`.
- Vercel Blob Hobby: whether a nonprofit's marketing page counts as non-commercial.
- Internet Archive: its current terms for promotional or sales use. The terms page did not load without a script.
- Bunny Storage: rate, range support and own-domain use. Bunny's nonprofit program.
- Loom Starter: bandwidth cap and commercial-use terms. Whether the 4:35 video fits within the 5 minute limit once the real running time is known.
- Streamable, Cloudinary and Supabase figures were seen through search summaries, not the vendor pages (marked in the tables). Gumlet's Creator bandwidth (3,000 GB) and overage rate ($0.10 per GB) are from a search summary too, so the Gumlet paid cases in the cost tables are approximate.
- Google Drive and Dropbox: what the viewer looks like, and whether their terms allow a marketing page to play from a shared link.
- ImageKit, Cloudinary, Uploadcare, Gumlet and api.video: the player's look, branding on paid plans, and whether each re-encodes the upload.
- Video.js 10: how to attach our own listeners to the `<video>` element inside its player (the GA guide covers Google Analytics only), and whether it shows any logo in the default skin. The `next-video` default theme "Sutro by Mux": whether it shows a Mux logo.
- Whether Mux Player can play a source that is not hosted on Mux.
- The weak-signal comparison between a 720p faststart MP4 and Mux is my reasoning, not a test. A phone test on a throttled connection would show how far apart they are.
- The `ffmpeg` command has not been run. FFmpeg's Trac H.264 guide was blocked to my tools, so the CRF scale and default come from the x264 source ([x264-src]).
- Self-made HLS: the `ffmpeg` options, hosting and CORS settings were not read.

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
[hl-limits]: https://help.gohighlevel.com/support/solutions/articles/48001216629-media-storage-file-upload-limits
[hl-filetypes]: https://help.gohighlevel.com/support/solutions/articles/155000008425-expanded-file-type-support-in-highlevel-media-library
[hl-api-upload]: https://marketplace.gohighlevel.com/docs/ghl/medias/upload-media-content.md
[hl-import]: https://gohighlevelassist.freshdesk.com/support/solutions/articles/155000002707--new-media-storage-help-document
[hl-domain-idea]: https://ideas.gohighlevel.com/media-library/p/media-image-library-to-point-to-our-domain-not-storagegoogleapis-or-assetscdnfil
[hl-url-example]: https://ideas.gohighlevel.com/media-library/p/improve-image-quality
[hl-measured]: https://assets.cdn.filesafe.space/acfU35MpBmXGmdW5smdq/media/69e99be2a48992f689c93aed.jpg
[hl-hosted-video]: https://help.gohighlevel.com/support/solutions/articles/48001224428-hosted-video-player-for-funnels
[hl-leadgen]: https://help.gohighlevel.com/support/solutions/articles/155000001064-lead-generation-with-hosted-videos-using-forms
[hl-tracking-trigger]: https://help.gohighlevel.com/support/solutions/articles/155000003142-trigger-video-tracking
[hl-pip]: https://ideas.gohighlevel.com/changelog/picture-in-picture-mode-on-hosted-video-scroll
[hl-lazy]: https://ideas.gohighlevel.com/changelog/boosted-page-speed-performance-video-element-and-thumbnail-optimization-in-funne
[hl-tos]: https://www.gohighlevel.com/terms-of-service
[hl-pricing]: https://www.gohighlevel.com/pricing
[cf-pages-limits]: https://developers.cloudflare.com/pages/platform/limits/
[bunny-quickstart]: https://bunny.net/docs/quickstart
[b2-pricing]: https://www.backblaze.com/cloud-storage/pricing
[b2-txn]: https://www.backblaze.com/cloud-storage/transaction-pricing
[b2-range]: https://www.backblaze.com/apidocs/b2-download-file-by-name
[gh-releases]: https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases
[gh-pages-limits]: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
[gh-aup]: https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies
[gh-release-measured]: https://github.com/cli/cli/releases/download/v2.40.0/gh_2.40.0_checksums.txt
[ia-terms]: https://archive.org/about/terms.php
[ia-rights]: https://help.archive.org/help/rights/
[loom-pricing]: https://www.loom.com/pricing
[streamable-pricing]: https://streamable.com/pricing
[drive-limit]: https://support.google.com/drive/answer/2423534?hl=en
[dropbox-banned]: https://help.dropbox.com/share/banned-links
[imagekit-plans]: https://imagekit.io/plans/
[cloudinary-plans]: https://cloudinary.com/pricing
[cloudinary-size]: https://support.cloudinary.com/hc/en-us/articles/202520592-Do-you-have-a-file-size-limit
[apivideo-pricing]: https://api.video/pricing/
[gumlet-blog]: https://www.gumlet.com/blog/gumlet-pricing-update-2026/
[uploadcare-pricing]: https://uploadcare.com/pricing/
[supabase-limits]: https://supabase.com/docs/guides/storage/uploads/file-limits
[supabase-egress]: https://supabase.com/docs/guides/storage/serving/bandwidth
[videojs-readme]: https://raw.githubusercontent.com/videojs/video.js/main/README.md
[videojs-license]: https://raw.githubusercontent.com/videojs/video.js/main/LICENSE
[videojs-site]: https://videojs.org/
[videojs-react-install]: https://videojs.org/docs/guides/installation/react.md
[videojs-react-index]: https://videojs.org/docs/framework/react/llms.txt
[videojs-compat]: https://videojs.org/docs/framework/react/reference/components/video-compat-skin.md
[videojs-browsers]: https://videojs.org/docs/framework/react/guides/browser-support.md
[videojs-ga]: https://videojs.org/docs/framework/react/guides/google-analytics.md
[plyr-repo]: https://api.github.com/repos/sampotts/plyr
[vidstack-repo]: https://api.github.com/repos/vidstack/player
[media-chrome-repo]: https://api.github.com/repos/muxinc/media-chrome
[media-chrome-docs]: https://www.media-chrome.org/docs/en/get-started
[hlsjs-license]: https://raw.githubusercontent.com/video-dev/hls.js/master/LICENSE
[next-video-readme]: https://raw.githubusercontent.com/muxinc/next-video/main/README.md
[next-video-repo]: https://api.github.com/repos/muxinc/next-video
[mdn-range]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests
[ffmpeg-formats]: https://ffmpeg.org/ffmpeg-formats.html
[ffmpeg-codecs]: https://ffmpeg.org/ffmpeg-codecs.html
[ffmpeg-filters]: https://ffmpeg.org/ffmpeg-filters.html
[x264-src]: https://raw.githubusercontent.com/mirror/x264/master/x264.c
[x264-base]: https://raw.githubusercontent.com/mirror/x264/master/common/base.c
[meta-custom]: https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking
[hlsjs-measured]: https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js
[videojs8-measured]: https://cdn.jsdelivr.net/npm/video.js@8.23.4/dist/video.min.js
[plyr-measured]: https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.min.js
