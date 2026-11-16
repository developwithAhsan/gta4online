# Cloudflare Pages deployment

This repository is a static HTML/CSS/JavaScript site. It has no package manager, framework build, server runtime, or game-engine build step.

## Create the production project

1. Open the Cloudflare dashboard and go to **Workers & Pages**.
2. Choose **Create application** → **Pages** → **Connect to Git**.
3. Connect GitHub and select `developwithAhsan/gta4online`.
4. Set the production branch to `main`.
5. Choose **None** as the framework preset.
6. Leave the build command blank (there is no build step).
7. Set the build output directory to `.` (the repository root).
8. Leave the root directory as `/` and save/deploy.

No npm install, npm build, Vite build, or Wrangler command is needed for this Pages setup. The deployed output is the repository root.

## Files prepared for Cloudflare

- `_headers`: security response headers and conservative browser cache lifetimes.
- `_redirects`: root/index normalization, blog trailing slash, and old GTA 5 article URL redirects.
- `404.html`: custom not-found page.
- `robots.txt` and `sitemap.xml`: point at the default `gta4online.pages.dev` hostname.

## Important: confirm the production hostname

The current SEO canonical URLs and sitemap use `https://gta4online.pages.dev`. If the Pages project is created with a different project name, or if you attach a custom domain, replace that hostname in all canonical tags, Open Graph URLs, JSON-LD page URLs, `robots.txt`, and `sitemap.xml` before submitting the sitemap to search engines.

## After the first deployment

1. Open the generated `*.pages.dev` address.
2. Check the homepage, `/blog/`, one blog article, `/about.html`, `/contact.html`, and a random missing URL (which should show the custom 404 page).
3. Confirm CSS and JavaScript load without 404 errors.
4. Add the custom domain in **Workers & Pages → your Pages project → Custom domains** if required.
5. Once the final hostname is known, update canonical URLs and sitemap to that hostname, then submit `/sitemap.xml` in Google Search Console.

## Current gameplay limitation

This repository currently contains the GTA IV information portal and its controls interface, not the original GTA IV game engine or game data. Cloudflare hosting will publish the website; it will not create a GTA IV browser client or multiplayer backend.
