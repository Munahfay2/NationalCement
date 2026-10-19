# National Cement Company – site recreation

A faithful recreation of **https://nationalcementcompany.co.ke** (inspected October 2026). It is a static site with no dependencies: a small Node build script turns one config file into plain HTML that uses Tailwind (Play CDN), the same as the original.

## Quick start
```bash
node -v          # needs Node 18 or newer
npm start        # builds dist/ and serves it at http://localhost:3000
npm run build    # build only -> dist/
```

## Structure
```
src/site.config.js   ← ALL branding and content: name, phone, WhatsApp, email, colours, text, products, deals, jobs, SEO meta
src/build.js         page templates + generator (also writes sitemap.xml and robots.txt)
public/js/menu.js    mobile hamburger menu
public/js/cart.js    product modal, cart (saved in localStorage) and WhatsApp checkout
public/logos  public/icons  public/banners  public/images/products  public/images (client photos go here)  public/ads (empty)
server.js            local static server with clean URLs (/about → about.html)
netlify.toml         Netlify build settings (the original site is hosted on Netlify)
```

## Pages and features
| Route | Contents |
|---|---|
| `/` | Hero, trust bar, testimonials, Google Map, "Great Deal" popup after 1.5 s, floating WhatsApp/Call buttons |
| `/about` | Hero (company2.jpg), Who We Are / Mission / Why Choose, trust block |
| `/products` | 11 products, quantity modal, cart, **Checkout via WhatsApp** (pre-filled order message) |
| `/sustainability` | 3 cards and a popup that cycles through 3 deals and reopens every 5 s (same as the original) |
| `/careers` | 2 jobs, "Apply via WhatsApp" links, job popup that cycles every 6 s. This page is in the sitemap but not in the nav (same as the original) |
| `/contact` | Location, `tel:`, `mailto:` and WhatsApp links |

All buttons do something real: `tel:` links, `wa.me` links, the cart and the menu. The original has **no forms**, so there are none here.

## Ads and third parties
- **No ad network** was found on the original. The only promotional slots are the house "GREAT DEAL" and "HOT JOB" popups. They are reproduced exactly, and their content is set in the config. `public/ads/` is left empty for future use.
- **Google Tag Manager** `GTM-PF32JHZP` (the original's container ID) is included by default. Set the env var `GTM_ID=""` at build time to turn it off, or `GTM_ID=GTM-XXXX` to use your own container. **You should replace it.**
- **Google Maps**: the original embed URL has a placeholder place ID (`0x182f107f1234567:0xabcdef123456`), so the map shows nothing useful. Replace `home.mapEmbed` with a real embed URL.

## Environment variables
| Var | Default | Purpose |
|---|---|---|
| `GTM_ID` | `GTM-PF32JHZP` | GTM container; an empty string disables it |
| `PORT` | `3000` | local server port |

## Known differences and quirks of the original (kept on purpose)
- **Missing images on the live site** (they return 404 there too): `client1.jpg`, `client2.jpg`, `client3.jpg`, `powerplus.jpg`, `blue_triangle.jpg`. They show as broken images, exactly like the original. Add files with those names to `public/images/` and `public/images/products/`.
- **Home page footer is nearly invisible**: the original home page never defines the Tailwind `brand` colour, so the footer is light grey text on white. This is reproduced. Set `quirks.homeMissingBrandColors: false` to give it the navy background used on the other pages.
- Small differences between pages are copied as-is: the About nav has no "Sustainability" link, footer link sets and column counts vary, and the phone number is written in two formats.
- **Small fixes on my side**: the About page hamburger did nothing on the original (it had no menu or script); here it opens the standard mobile menu. Popups also close on a backdrop click or Esc, the cart is saved across page loads, and the logo links to home.
- Asset paths are root-absolute (`/logos/logo.png` and so on) instead of the original's relative `images/...`.

## Deployment (not done; needs your approval)
- **Netlify**: connect the repo. `netlify.toml` already sets `npm run build` → `dist` with pretty URLs.
- **Any static host** (Vercel, Cloudflare Pages, S3, nginx): run `npm run build` and serve `dist/`. Map `/about` → `/about.html` (most hosts do this automatically or with a one-line rewrite).

## Still to configure
1. Your own GTM ID, or turn it off.
2. A real Google Maps embed.
3. The 5 missing images.
4. Tailwind Play CDN is not recommended for production. For the same look with less weight, swap in a compiled Tailwind v3 CSS build.
5. Check that the email `info@nationalcement.co.ke` is correct. It uses a different domain from the website, as on the original.
6. Make sure you have the rights to the logos and product photos (Simba, Rhino and so on are third-party brands).
