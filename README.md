# GTAV Online Hub

A responsive, static fan-made gaming hub with an embedded third-party game portal, quick controls, beginner guides, FAQs, and basic technical SEO.

## Features
- Responsive dark interface with lime accents
- Third-party iframe for https://playgta5.site/
- Direct external launch fallback, reload and fullscreen controls
- Accessible navigation and reduced-motion support
- Metadata, Open Graph tags, JSON-LD, sitemap.xml and robots.txt
- About and privacy information pages
- No build step or server-side dependencies

## Deploy on Vercel
1. Import `developwithAhsan/GTAVonline` into Vercel.
2. Select **Other** as the framework preset if prompted.
3. Leave build command empty and output directory as the repository root.
4. Deploy.

## SEO hostname and sitemap submission

The confirmed public hostname is `https://playgtav.vercel.app`. The HTML canonical/Open Graph URLs, sitemap, and robots.txt should all use this exact hostname. If the Vercel domain is later changed, update these URLs together.

- Sitemap: `https://playgtav.vercel.app/sitemap.xml`
- Robots: `https://playgtav.vercel.app/robots.txt`

The sitemap lists the 36 existing HTML content pages and excludes `404.html`. The robots file allows crawling and points to that sitemap. If you later attach a custom domain, update the sitemap and robots sitemap URL to the custom domain, and make every page's canonical and Open Graph URL use that same hostname.

### Submit after deployment
1. Open the sitemap URL in a private/incognito browser window. It must return XML, not a 404 page, login page, HTML error page, or redirect to a different hostname.
2. In Google Search Console, select the property that exactly matches the deployed hostname and submit `sitemap.xml` (or the full URL above).
3. In Bing Webmaster Tools, select the same site hostname and submit the same sitemap URL.
4. If a tool still reports an error, record the exact error text and check that the deployed site serves the latest Git commit, that HTTPS works, and that every sitemap URL returns a successful page response.
5. A successful sitemap submission does not guarantee indexing. Search engines decide whether and when to index each URL.

## Embed limitation
The site tries to display playgta5.site in an iframe. The external provider can block framing using its security headers, and client-side code cannot override that restriction. The direct link is included as a fallback. A successful iframe load event does not guarantee the game itself has loaded or is playable.

## SEO checklist
- Verify the final canonical hostname before indexing.
- Register the property in Google Search Console and Bing Webmaster Tools.
- Submit `/sitemap.xml` after deployment.
- Use unique, useful content for any future guide pages; do not generate thin or repetitive keyword pages.
- Add real social preview artwork and image metadata after original assets are available.
- Avoid claiming the site hosts the official GTA V game or is affiliated with Rockstar Games.
- Check mobile usability, performance, HTTPS, crawlability and structured-data validity after deployment.

## Independence
Unofficial fan project. Grand Theft Auto and related marks are owned by their respective rights holders. The external game website is not controlled by this project.
